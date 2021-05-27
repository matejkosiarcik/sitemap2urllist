use crate::internal::utils::*;

pub fn save(path: &str, urls: &[String]) -> Result<()> {
    let mut content: String = urls.join("\n");
    if !content.is_empty() {
        content.push('\n');
    }

    if path == "-" {
        write_stdout(content.as_str())?;
    } else {
        write_file(path, content.as_str())?;
    }
    Ok(())
}
