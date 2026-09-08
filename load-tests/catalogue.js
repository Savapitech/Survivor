import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    catalogue_browsing: {
      executor: 'constant-vus',
      vus: Number(__ENV.VUS || 100),
      duration: __ENV.DURATION || '2m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

const catalogueTrend = new Trend('catalogue_list_duration', true);
const profileTrend = new Trend('catalogue_profile_duration', true);
const videoTrend = new Trend('catalogue_video_duration', true);

export function setup() {
  const res = http.get(`${BASE_URL}/seekers?page=1&pageSize=20`);
  const totalPages = JSON.parse(res.body).totalPages;
  return { totalPages };
}

export default function (data) {
  const page = Math.floor(Math.random() * data.totalPages) + 1;
  const listRes = http.get(
    `${BASE_URL}/seekers?page=${page}&pageSize=20`,
    { tags: { name: 'GET /seekers' } },
  );
  catalogueTrend.add(listRes.timings.duration);
  check(listRes, { 'catalogue 200': (r) => r.status === 200 });

  let seekerIds = [];
  try {
    seekerIds = JSON.parse(listRes.body).data.map((s) => s.id);
  } catch {
    seekerIds = [];
  }

  if (seekerIds.length > 0) {
    const id = seekerIds[Math.floor(Math.random() * seekerIds.length)];
    const profileRes = http.get(`${BASE_URL}/seekers/${id}`, {
      tags: { name: 'GET /seekers/:id' },
    });
    profileTrend.add(profileRes.timings.duration);
    check(profileRes, { 'profile 200': (r) => r.status === 200 });

    let videoProvider = null;
    try {
      videoProvider = JSON.parse(profileRes.body).videoProvider;
    } catch {
      videoProvider = null;
    }

    if (videoProvider === 'local') {
      const videoRes = http.get(`${BASE_URL}/seekers/${id}/video/stream`, {
        tags: { name: 'GET /seekers/:id/video/stream' },
      });
      videoTrend.add(videoRes.timings.duration);
      check(videoRes, {
        'video 200 or 404': (r) => r.status === 200 || r.status === 404,
      });
    }
  }

  sleep(1);
}
