extern crate getopts;

mod lib;

use std::{env, process};
use getopts::Options;

use lib::{shuffle, pick, group};

fn main() {
    let args: Vec<String> = env::args().collect();

    let mut opts = Options::new();

    opts.reqopt("i", "items", "comma separated list of items", "foo,bar,baz,qux");
    opts.optopt("g", "group", "group items by provided N number", "3");
    opts.optopt("p", "pick", "pick N shuffled items ", "3");
    opts.optopt("s", "seed", "seed value for the shuffler", "seed-value");

    let usage = "shuffler(1) is a small utility program to shuffle provided items with fisher-yates algorithm";

    let matches = match opts.parse(&args[1..]) {
        Ok(m) => m,
        Err(f) => panic!(f.to_string()),
    };


    let i = matches.opt_str("items").unwrap_or_else(|| {
        opts.usage(usage);

        process::exit(1);
    });
    let s = matches.opt_str("seed");

    let g = if matches.opt_present("group") {
        let v = matches.opt_str("group").unwrap();

        Some(v.parse::<usize>().unwrap_or_else(|_| {
            opts.usage(usage);

            process::exit(1);
        }))
    } else {
        None
    };

    let p = if matches.opt_present("pick") {
        let v = matches.opt_str("pick").unwrap();

        Some(v.parse::<usize>().unwrap_or_else(|_| {
            opts.usage(usage);

            process::exit(1);
        }))
    } else {
        None
    };

    let src = i.split(",").collect::<Vec<_>>();

    if g.is_some() {
        let groups = group(&src, g.unwrap(), &s);
        let picks = p.unwrap_or(groups.len());

        let res;
        if groups.len() <= picks {
            res = groups;
        } else {
            res = groups.chunks(picks).next().unwrap().to_vec();
        }

        for v in res {
            println!("{}", v.join(", "));
        }

        return;
    };

    let res;
    if p.is_some() {
        res = pick(&src, p.unwrap(), &s);
    } else {
        res = shuffle(&src, &s);
    }

    for v in res {
        println!("{}", v);
    }

    return;
}
