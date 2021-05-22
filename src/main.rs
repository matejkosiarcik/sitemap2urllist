use clap::Clap;
use sitemap2urllist::{convert, save};
use async_std::task;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

#[derive(Clap, Debug)]
#[clap(name = env!("CARGO_PKG_NAME"), version = env!("CARGO_PKG_VERSION"))]
struct Args {
    /// Output path for urllist (- for stdout)
    #[clap(short, long, default_value = "-")]
    output: String,

    /// Input path or URL for sitemap (- for stdin)
    #[clap(short, long, default_value = "-")]
    file: String,

    /// Include alternate links
    #[clap(long)]
    alternate: bool
}

fn main() -> Result<()> {
    let args = Args::parse();
    task::block_on(async_main(args))?;
    Ok(())
}

async fn async_main(args: Args) -> Result<()> {
    let urls = convert(&args.file, args.alternate).await?;
    save(args.output.as_str(), &urls).await?;
    Ok(())
}
