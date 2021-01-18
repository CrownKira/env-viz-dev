export default function loadScript(src, id, cb) {
  let script = document.getElementById(id);

  if (!script) {
    script = document.createElement('script');
    script.src = src;
    script.id = id;
    document.body.appendChild(script);
    script.onload = () => cb && cb();
  } else {
    cb && cb();
  }

  return script;
}
