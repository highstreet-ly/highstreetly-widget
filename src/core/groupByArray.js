export default (xs, key) => {
    return xs.reduce(function (rv, x) {
      let v = key instanceof Function ? key(x) : x[key];
      let el = rv.find((r) => r && r.key === v);
      if (el) {
        el.values.push(x);
      } else {
        rv.push({ key: v, values: [x] });
      }
      return rv;
    }, []);
  }