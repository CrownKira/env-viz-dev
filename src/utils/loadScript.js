export default function loadScript(src, id, cb) {
  const existingScript = document.getElementById(id);

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    document.body.appendChild(script);
    script.onload = () => cb && cb();
  } else {
    cb && cb();
  }
}
