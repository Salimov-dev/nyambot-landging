import Script from "next/script";
import { ANALYTICS_CONFIG } from "@/config/analytics.config";

export function YandexMetrika() {
  const { yandexMetrikaId, yandexMetrikaOptions } = ANALYTICS_CONFIG;

  if (!yandexMetrikaId) return null;

  const initScript = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${yandexMetrikaId}", "ym");

    ym(${yandexMetrikaId}, "init", Object.assign(${JSON.stringify(yandexMetrikaOptions)}, {referrer: document.referrer, url: location.href}));
  `.trim();

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initScript }}
      />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
