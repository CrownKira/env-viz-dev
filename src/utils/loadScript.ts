export default function loadScript(src: string, id: string, cb?: Function): HTMLScriptElement {
  let script = document.getElementById(id) as HTMLScriptElement | null;

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
