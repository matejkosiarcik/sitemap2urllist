use crate::internal::error::MyError;
use crate::internal::url_entry::UrlEntry;
use crate::internal::utils::*;

use std::fs::File;
use std::io::stdin;
use std::io::prelude::*;
use url::Url;
use xmltree::Element;
use std::collections::VecDeque;

pub async fn convert(input: &str, alternate: bool) -> Result<Vec<String>> {
    let mut entries = collect_entries(input).await?;
    entries.sort();

    let urls: Vec<String> = entries
        .iter()
        .map(|entry| {
            let mut urls: Vec<String> = vec![entry.url.as_str().to_string()];
            if alternate {
                entry
                    .alt_urls
                    .iter()
                    .for_each(|url| urls.push(url.as_str().to_string()));
            }
            return urls;
        })
        .flatten()
        .collect();
    return Ok(urls);
}

async fn collect_entries(location: &str) -> Result<Vec<UrlEntry>> {
    let mut urls: VecDeque<String> = VecDeque::new();
    urls.push_back(location.to_string());
    let mut entries: Vec<UrlEntry> = vec![];

    // Loop till we have no more URLs to read
    // We start with a single URL
    // But because sitemaps can have <sitemapindex> it can grow unpredictably
    while !urls.is_empty() {
        let url = urls.pop_front().unwrap();
        let content =  read(url.as_str()).await?;
        let root = Element::parse(content.as_bytes())?;

        if root.name == "urlset" {
            entries.append(&mut collect_urlset(&root)?);
        } else if root.name == "sitemapindex" {
            collect_sitemapindex(&root)?
                .into_iter()
                .for_each(|url | urls.push_back(url));
        } else {
            return Err(Box::from(MyError::new(format!(
                "Unknown xml root: {}; expected <urlset> or <sitemapindex>.",
                root.name
            ))));
        }
    }

    Ok(entries)
}

fn collect_urlset(root: &Element) -> Result<Vec<UrlEntry>> {
    assert_eq!(root.name, "urlset");
    let entries = root
        .children
        .iter()
        .flat_map(|node| node.as_element())
        .filter(|el| el.name == "url")
        .map(|el| {
            let _url = match el.get_child("loc") {
                None => "".to_string(),
                Some(loc) => loc
                    .get_text()
                    .map(|cow| cow.to_string())
                    .unwrap_or("".to_string()),
            };
            let url = _url.trim().to_string();

            let priority: f64 = match el.get_child("priority") {
                None => 0.5,
                Some(priority) => priority
                    .get_text()
                    .map(|cow| cow.to_string())
                    .unwrap_or("".to_string())
                    .trim()
                    .parse()
                    .unwrap_or(0.5),
            };

            let alt_urls: Vec<String> = el
                .children
                .iter()
                .flat_map(|node| node.as_element())
                .filter(|el| el.name == "link" || el.name == "xhtml:link")
                .filter(|el| el.attributes["rel"] == "alternate")
                .map(|el| el.attributes["href"].as_str().to_string())
                .filter(|href| href.len() > 0)
                .collect();

            return UrlEntry {
                url,
                priority,
                alt_urls,
            };
        })
        .collect();
    Ok(entries)
}

fn collect_sitemapindex(root: &Element) -> Result<Vec<String>> {
    assert_eq!(root.name, "sitemapindex");
    let sitemap_urls: Vec<String> = root
        .children
        .iter()
        .flat_map(|node| node.as_element())
        .filter(|el| el.name == "sitemap")
        .flat_map(|el| el.get_child("loc"))
        .flat_map(|el| el.get_text())
        .map(|cow| cow.to_string())
        .collect();
    Ok(sitemap_urls)
}

async fn read(input: &str) -> Result<String> {
    let url = Url::parse(input);
    let mut content: String = "".to_string();

    if input == "-" {
        stdin().read_to_string(&mut content)?;
    } else if url.is_ok() {
        let url = url.unwrap();
        if url.scheme() == "http" || url.scheme() == "https" {
            #[cfg(target_arch = "wasm32")]
                {
                    content = reqwest::get(url).await?.text().await?;
                }

            #[cfg(not(target_arch = "wasm32"))]
                {
                    content = surf::get(url.to_string()).await?.body_string().await?;
                }
        } else if url.scheme() == "file" {
            let mut file = File::open(url.path())?;
            file.read_to_string(&mut content)?;
        } else {
            return Err(Box::from(MyError::new(format!(
                "Unexpected url scheme {} from {}",
                url.scheme(),
                input
            ))));
        }
    } else {
        let mut file = File::open(input)?;
        file.read_to_string(&mut content)?;
    }

    Ok(content)
}
