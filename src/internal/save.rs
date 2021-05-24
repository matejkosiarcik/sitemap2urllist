use crate::internal::utils::*;

use std::fs::File;
use std::io::prelude::*;
use std::io::stdout;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(module = "/glue.js")]
extern "C" {
    fn writeStdoutJS(content: &str);
    fn writeFileJS(path: &str, content: &str);
}

pub fn save(path: &str, urls: &[String]) -> Result<()> {
    let mut content: String = urls.join("\n");
    if !content.is_empty() {
        content.push('\n');
    }

    if path == "-" {
        #[cfg(target_arch = "wasm32")]
        {
            writeStdoutJS(content.as_str());
        }

        #[cfg(not(target_arch = "wasm32"))]
        {
            stdout().write_all(content.as_bytes())?;
        }
    } else {
        #[cfg(target_arch = "wasm32")]
        {
            writeFileJS(path, content.as_str());
        }

        #[cfg(not(target_arch = "wasm32"))]
        {
            let mut file = File::create(path)?;
            file.write_all(content.as_bytes())?;
        }
    }
    Ok(())
}
