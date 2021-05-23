mod internal;
use crate::internal::convert;
use crate::internal::save;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
use js_sys::Array;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

#[cfg(target_arch = "wasm32")]
type JsResult<T> = std::result::Result<T, JsValue>;

#[cfg(not(target_arch = "wasm32"))]
pub async fn convert(input: &str, alternate: bool) -> Result<Vec<String>> {
    convert::convert(input, alternate).await
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub async fn convert(input: &str, alternate: bool) -> JsResult<Array> {
    match convert::convert(input, alternate).await {
        Err(error) => return Err(JsValue::from_serde(&error.to_string()).unwrap()),
        Ok(value) => return Ok(value.into_iter().map(JsValue::from).collect()),
    }
}

#[cfg(not(target_arch = "wasm32"))]
pub fn save(output: &str, urls: &Vec<String>) -> Result<()> {
    save::save(output, urls)
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn save(output: &str, urls: &Array) -> JsResult<()> {
    let urls2: Vec<String> = urls
        .iter()
        .filter(|jsvalue| jsvalue.is_string())
        .flat_map(|jsvalue| jsvalue.as_string())
        .collect();
    match save::save(output, &urls2) {
        Err(error) => return Err(JsValue::from_serde(&error.to_string()).unwrap()),
        Ok(value) => return Ok(value),
    }
}

pub const fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}
