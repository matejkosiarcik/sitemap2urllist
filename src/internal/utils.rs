pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(not(target_arch = "wasm32"))]
use {
    std::fs::File,
    std::io::{prelude::*, stdin, stdout},
};

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(module = "/glue.js")]
extern "C" {
    fn readStdinJS() -> String;
    fn writeStdoutJS(content: &str);

    fn readFileJS(path: &str) -> String;
    fn writeFileJS(path: &str, content: &str);
}

pub fn write_stdout(content: &str) -> Result<()> {
    #[cfg(target_arch = "wasm32")]
    {
        writeStdoutJS(content);
    }

    #[cfg(not(target_arch = "wasm32"))]
    {
        stdout().write_all(content.as_bytes())?;
    }

    Ok(())
}

pub fn write_file(path: &str, content: &str) -> Result<()> {
    #[cfg(target_arch = "wasm32")]
    {
        writeFileJS(path, content);
    }

    #[cfg(not(target_arch = "wasm32"))]
    {
        let mut file = File::create(path)?;
        file.write_all(content.as_bytes())?;
    }

    Ok(())
}

pub fn read_stdin() -> Result<String> {
    #[cfg(target_arch = "wasm32")]
    {
        Ok(readStdinJS())
    }

    #[cfg(not(target_arch = "wasm32"))]
    {
        let mut content = String::new();
        stdin().read_to_string(&mut content)?;
        Ok(content)
    }
}

pub fn read_file(path: &str) -> Result<String> {
    #[cfg(target_arch = "wasm32")]
    {
        Ok(readFileJS(path))
    }

    #[cfg(not(target_arch = "wasm32"))]
    {
        let mut content = String::new();
        let mut file = File::open(path)?;
        file.read_to_string(&mut content)?;
        Ok(content)
    }
}
