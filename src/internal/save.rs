use crate::internal::utils::*;

use std::fs::File;
use std::io::stdout;
use std::io::prelude::*;

// TODO: &Vec or Vec?
pub fn save(output: &str, urls: &Vec<String>) -> Result<()> {
    let mut content: String = urls.join("\n");
    if !content.is_empty() {
        content.push_str("\n");
    }

    if output == "-" {
        stdout().write_all(content.as_bytes())?;
    } else {
        let mut file = File::create(output)?;
        file.write_all(content.as_bytes())?;
    }
    Ok(())
}
