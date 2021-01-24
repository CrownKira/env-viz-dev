export default function loadScript(src: string, id: string, cb?: any): HTMLScriptElement {
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    (script as HTMLScriptElement).src = src;
    script.id = id;
    document.body.appendChild(script);
    script.onload = () => cb && cb();
  } else {
    cb && cb();
  }

  return script;
}
