use rand::prelude::*;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

fn make_rng(src: &Option<String>) -> StdRng {
    match src {
        Some(s) => {
            let mut h = DefaultHasher::new();
            s.hash(&mut h);

            StdRng::seed_from_u64(h.finish())
        },
        None => StdRng::from_entropy(),
    }
}

///
pub fn shuffle<T: Clone>(list: &Vec<T>, seed: &Option<String>) -> Vec<T> {
    let mut src = list.clone();
    let mut rng = make_rng(seed);

    let mut l = src.len();
    while l >= 2 {
        l -= 1;

        src.swap(l, rng.gen_range(0..l + 1))
    }

    src
}

///
pub fn pick<T: Copy>(list: &Vec<T>, count: usize, seed: &Option<String>) -> Vec<T> {
    let src = shuffle(list, seed);

    let l = src.len();
    if count >= l {
        return src;
    }

    let mut val: Vec<T> = Vec::new();
    let mut ignore: Vec<usize> = Vec::new();

    let mut rng = make_rng(seed);

    for _ in 0..count {
        let mut i = rng.gen_range(0..l);
        while ignore.contains(&i) {
            i = rng.gen_range(0..l);
        }

        val.push(src[i]);
        ignore.push(i);
    }

    val
}

///
pub fn group<T: Copy + PartialEq>(list: &Vec<T>, count: usize, seed: &Option<String>) -> Vec<Vec<T>> {
    let mut src = list.clone();

    let l = src.len();
    if count >= l {
        return vec![src];
    }

    let mut val: Vec<Vec<T>> = Vec::new();

    let max = (l as f64 / count as f64).ceil() as i64;

    for _ in 0..max {
        let v = pick(&src, count, seed)
            .iter()
            .map(|&v| {
                src.remove(src.iter().position(|&x| v == x).unwrap());

                v
            })
            .collect::<Vec<T>>();

        val.push(v);
    }

    val
}
