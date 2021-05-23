use std::error::Error;
use std::fmt;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct MyError {
    pub message: String,
}

impl MyError {
    pub fn new(message: String) -> Self {
        Self { message }
    }
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "MyError: {}", self.message)
    }
}

impl Error for MyError {}
