use std::cmp::Ordering;

#[derive(PartialEq)]
pub struct UrlEntry {
    pub url: String,
    pub priority: f64,
    pub alt_urls: Vec<String>,
}

impl Ord for UrlEntry {
    fn cmp(&self, other: &Self) -> Ordering {
        if (self.priority - other.priority).abs() > 0.001 {
            return if self.priority < other.priority {
                Ordering::Greater
            } else {
                Ordering::Less
            };
        }

        self.url.cmp(&other.url)
    }
}

impl PartialOrd for UrlEntry {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Eq for UrlEntry {}
