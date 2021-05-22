mod error;
pub use crate::error::MyError;
mod url_entry;
pub use crate::url_entry::UrlEntry;

use std::error::Error;
use xmltree::Element;
use async_std::fs::File;
use async_std::prelude::*;
use async_std::io::{stdin, stdout};
use url::Url;
use async_recursion::async_recursion;

type Result<T> = std::result::Result<T, Box<dyn Error>>;

// TODO: &Vec or Vec?
pub async fn save(output: &str, urls: &Vec<String>) -> Result<()> {
    let mut content: String = urls.join("\n");
    if !content.is_empty() {
        content.push_str("\n");
    }

    if output == "-" {
        stdout().write_all(content.as_bytes()).await?;
    } else {
        let mut file = File::create(output).await?;
        file.write_all(content.as_bytes()).await?;
    }
    Ok(())
}

pub async fn convert(input: &str, alternate: bool) -> Result<Vec<String>> {
    let content = read(input).await?;

    let mut entries = collect_entries(content.as_str()).await?;
    entries.sort();

    let urls: Vec<String> = entries.iter()
        .map(|entry| {
            // return entry.url.as_str().to_string();
            let mut urls: Vec<String> = vec![entry.url.as_str().to_string()];
            if alternate {
                entry.alt_urls.iter().for_each(|url| urls.push(url.as_str().to_string()));
            }
            return urls;
        })
        .flatten()
        .collect();
    return Ok(urls);
}

#[async_recursion]
pub async fn collect_entries(content: &str) -> Result<Vec<UrlEntry>> {
    let root = Element::parse(content.as_bytes())?;

    if root.name == "urlset" {
        collect_urlset(&root)
    } else if root.name == "sitemapindex" {
        collect_sitemapindex(&root).await
    } else {
        Err(Box::from(MyError::new(format!("Unknown xml root: {}; expected <urlset> or <sitemapindex>.", root.name))))
    }
}

fn collect_urlset(root: &Element) -> Result<Vec<UrlEntry>> {
    let entries = root.children.iter()
        .flat_map(|node| node.as_element())
        .filter(|el| el.name == "url")
        .map(|el| {
            let _url = match el.get_child("loc") {
                None =>
                    "".to_string(),
                Some(loc) =>
                    loc.get_text().map(|cow| cow.to_string()).unwrap_or("".to_string())
            };
            let url = _url.trim().to_string();

            let priority: f64 = match el.get_child("priority") {
                None =>
                    0.5,
                Some(priority) =>
                    priority.get_text().map(|cow| cow.to_string()).unwrap_or("".to_string()).trim().parse().unwrap_or(0.5)
            };

            let alt_urls: Vec<String> = el.children.iter()
                .flat_map(|node| node.as_element())
                .filter(|el| el.name == "link" || el.name == "xhtml:link")
                .filter(|el| el.attributes["rel"] == "alternate")
                .map(|el| el.attributes["href"].as_str().to_string())
                .filter(|href| href.len() > 0)
                .collect();

            return UrlEntry { url, priority, alt_urls };
        })
        .collect();
    Ok(entries)
}

#[async_recursion]
async fn collect_sitemapindex(root: &Element) -> Result<Vec<UrlEntry>> {
    let sitemap_urls: Vec<String> = root.children.iter()
        .flat_map(|node| node.as_element())
        .filter(|el| el.name == "sitemap")
        .flat_map(|el| el.get_child("loc"))
        .flat_map(|el| el.get_text())
        .map(|cow| cow.to_string())
        .collect();

    let mut entries: Vec<UrlEntry> = vec![];
    for url in sitemap_urls {
        let content: String = read(url.trim()).await?;
        let mut entry: Vec<UrlEntry> = collect_entries(content.as_str()).await?;
        entries.append(&mut entry);
    }
    Ok(entries)
}

async fn read(input: &str) -> Result<String> {
    let url = Url::parse(input);
    let mut content: String = "".to_string();
    if input == "-" {
        stdin().read_to_string(&mut content).await?;
    } else if url.is_ok() {
        let url = url.unwrap();
        if url.scheme() == "http" || url.scheme() == "https" {
            let mut res = surf::get(url.to_string()).await?;
            content = res.body_string().await?;
        } else if url.scheme() == "file" {
            let mut file = File::open(url.path()).await?;
            file.read_to_string(&mut content).await?;
        } else {
            return Err(Box::from(MyError::new(format!("Unexpected url scheme {} from {}", url.scheme(), input))));
        }
    } else {
        let mut file = File::open(input).await?;
        file.read_to_string(&mut content).await?;
    }

    Ok(content)
}
