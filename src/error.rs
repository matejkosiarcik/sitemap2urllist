use std::fmt;
use std::error::Error;

#[derive(Debug)]
pub struct MyError {
    pub message: String,
}

impl MyError {
    pub fn new(message: String) -> Self {
        Self {
            message,
        }
    }
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "MyError: {}", self.message)
    }
}

impl Error for MyError {}
