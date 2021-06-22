use rand::prelude::*;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

fn make_rng(src: &Option<String>) -> StdRng {
    match src {
        Some(s) => {
            let mut h = DefaultHasher::new();
            s.hash(&mut h);

            StdRng::seed_from_u64(h.finish())
        }
        None => StdRng::from_entropy(),
    }
}

/// Shuffles all items in the provided vector using Fisher-Yates algorithm.
/// It takes seed value for deterministic results, in case of empty seed, it will generate
/// seed from entropy.
///
/// ## Examples
/// ```
/// let src = vec![1, 2, 3];
/// let seed = Some(String::from("some value"));
///
/// shuffler::shuffle(&src, &seed);
/// // [2, 1, 3]
/// ```
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

/// Picks N items from the provided vector. It returns vector with the picked items.
///
/// ## Examples
/// ```
/// let src = vec![1, 2, 3];
/// let seed = Some(String::from("some value"));
///
/// shuffler::pick(&src, 1, &seed);
/// // [2]
/// shuffler::pick(&src, 3, &seed);
/// // [2, 1, 3]
/// ```
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

/// Groups provided vector into chucks of the given size.
///
/// ## Examples
/// ```
/// let src = vec![1, 2, 3];
/// let seed = Some(String::from("some value"));
///
/// shuffler::group(&src, 2, &seed);
/// // [[2, 1], [3]]
/// shuffler::group(&src, 0, &seed);
/// // []
/// shuffler::group(&src, 10, &seed);
/// // [1, 2, 3]
/// ```
pub fn group<T: Copy + PartialEq>(list: &Vec<T>, count: usize, seed: &Option<String>) -> Vec<Vec<T>> {
    if count == 0 {
        return Vec::new()
    }

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

#[cfg(test)]
mod tests {
    use super::*;

    const SEED: &str = "some seed value";

    #[test]
    fn test_shuffle() {
        let src = vec![1, 2, 3, 4, 5];
        let seed = Some(String::from(SEED));

        let res = shuffle(&src, &seed);

        assert_ne!(src, res);
        assert_eq!(res.len(), src.len());
    }

    #[test]
    fn test_pick() {
        let src = vec![1, 2, 3, 4, 5];
        let seed = Some(String::from(SEED));

        let p0 = pick(&src, 1, &seed);
        assert_eq!(p0.len(), 1);

        let r0 = 3; // since it's deterministic
        assert_eq!(p0.first().unwrap(), &r0);

        let p1 = pick(&src, 3, &seed);
        assert_eq!(p1.len(), 3);

        let r1 = vec![3, 4, 1];
        assert_eq!(p1, r1);
    }

    #[test]
    fn test_group() {
        let src = vec![1, 2, 3, 4, 5];
        let seed = Some(String::from(SEED));

        let g0 = group(&src, 2, &seed);
        assert_eq!(g0, vec![vec![3, 4], vec![5, 2], vec![1]]);

        let g1 = group(&src, 1, &seed);
        assert_eq!(g1, vec![vec![3], vec![5], vec![4], vec![2], vec![1]]);

        let g2 = group(&src, 0, &seed);
        assert_eq!(g2.len(), 0);

        let g3 = group(&src, 5, &seed);
        assert_eq!(g3, vec![src]);
    }
}
