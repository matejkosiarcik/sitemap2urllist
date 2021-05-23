mod internal;
use crate::internal::convert;
use crate::internal::save;
use crate::internal::utils::*;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
use js_sys::Array;

#[cfg(target_arch = "wasm32")]
type JsResult<T> = std::result::Result<T, JsValue>;

#[cfg(not(target_arch = "wasm32"))]
pub async fn convert(input: &str, alternate: bool) -> Result<Vec<String>> {
    convert::convert(input, alternate).await
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub async fn convert(input: String, alternate: bool) -> JsResult<Array> {
    match convert::convert(input.as_str(), alternate).await {
        Ok(value) => return Ok(value.into_iter().map(JsValue::from).collect()),
        Err(error) => return Err(JsValue::from_serde(&error.to_string()).unwrap()),
    }
}

#[cfg(not(target_arch = "wasm32"))]
pub fn save(output: &str, urls: &Vec<String>) -> Result<()> {
    save::save(output, urls)
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn save(output: String, urls: &Array) -> JsResult<()> {
    let urls2: Vec<String> = urls
        .iter()
        .filter(|jsvalue| jsvalue.is_string())
        .flat_map(|jsvalue| jsvalue.as_string())
        .collect();
    match save::save(output.as_str(), &urls2) {
        Ok(value) => return Ok(value),
        Err(error) => return Err(JsValue::from_serde(&error.to_string()).unwrap()),
    }
}

#[cfg(not(target_arch = "wasm32"))]
pub const fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
