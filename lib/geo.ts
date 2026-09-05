import type { FeatureCollection, Geometry } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import { feature } from 'topojson-client';

/**
 * 육지 윤곽 (Natural Earth 110m, world-atlas@2.0.2).
 *
 * 국경선을 그리지 않으므로 countries가 아니라 land를 쓴다 — 105KB에서 54KB로 준다.
 * 파일은 public/geo/에 정적으로 들어 있다. CDN에서 받지 않는다.
 * 오프라인 PWA에서 CDN 의존은 치명적이다.
 *
 * S1 지구본과 S5 지도가 같은 파일을 쓰므로 모듈 레벨 Promise 하나로 캐싱한다.
 */

type LandTopology = Topology<{ land: GeometryCollection }>;

let landPromise: Promise<FeatureCollection<Geometry>> | null = null;

export function loadLand(): Promise<FeatureCollection<Geometry>> {
  if (!landPromise) {
    landPromise = fetch('/geo/land-110m.json')
      .then((res) => {
        if (!res.ok) throw new Error(`land-110m.json ${res.status}`);
        return res.json() as Promise<LandTopology>;
      })
      .then((topo) => feature(topo, topo.objects.land) as FeatureCollection<Geometry>)
      .catch((err) => {
        // 다음 마운트에서 다시 시도할 수 있게 캐시를 비운다.
        landPromise = null;
        throw err;
      });
  }
  return landPromise;
}
