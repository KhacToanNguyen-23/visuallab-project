/**
 * Centralized utility to resolve dedicated lab simulation routes based on lab ID, title, or route.
 */
export const getLabRoute = (labId?: string, title?: string, fallbackRoute?: string): string => {
  // 1. If fallbackRoute is already a valid dedicated route, use it directly!
  if (fallbackRoute && (fallbackRoute.startsWith('/lab/') || fallbackRoute.startsWith('/workbench/'))) {
    return fallbackRoute;
  }

  const id = (labId || '').toLowerCase().trim();
  const t = (title || '').toLowerCase().trim();

  // 2. Exact ID Mappings
  const ID_MAP: Record<string, string> = {
    'sim-speed-measurement': '/lab/speed-measurement',
    'speed-measurement': '/lab/speed-measurement',
    '10-b6': '/lab/speed-measurement',
    'sim-free-fall': '/lab/free-fall',
    'free-fall': '/lab/free-fall',
    '10-b14': '/lab/free-fall',
    'sim-friction-coefficient': '/lab/sliding-friction',
    'sim-sliding-friction': '/lab/sliding-friction',
    'sliding-friction': '/lab/sliding-friction',
    '10-b21': '/lab/sliding-friction',
    'sim-momentum-collision': '/lab/momentum-collision',
    'momentum-collision': '/lab/momentum-collision',
    '10-b30': '/lab/momentum-collision',
    'sim-hooke-law': '/lab/spring-mass',
    'sim-spring-mass': '/lab/spring-mass',
    'spring-mass': '/lab/spring-mass',
    '10-b38': '/lab/spring-mass',
    'sim-sound-resonance': '/lab/sound-resonance',
    'sound-resonance': '/lab/sound-resonance',
    '11-b5': '/lab/sound-resonance',
    'sim-simple-pendulum': '/lab/simple-pendulum',
    'simple-pendulum': '/lab/simple-pendulum',
    '11-b7': '/lab/simple-pendulum',
    'sim-young-interference': '/lab/wave-interference',
    'sim-wave-interference': '/lab/wave-interference',
    'wave-interference': '/lab/wave-interference',
    '11-b12': '/lab/wave-interference',
    'sim-emf-internal-r': '/lab/emf-internal-r',
    'emf-internal-r': '/lab/emf-internal-r',
    '11-b19': '/lab/emf-internal-r',
    'sim-refraction': '/lab/refraction',
    'refraction': '/lab/refraction',
    '11-b21': '/lab/refraction',
    'sim-dc-circuit': '/lab/dc-circuit',
    'dc-circuit': '/lab/dc-circuit',
    'sim-specific-heat': '/lab/specific-heat',
    'specific-heat': '/lab/specific-heat',
    '12-b3': '/lab/specific-heat',
    'sim-latent-heat': '/lab/latent-heat',
    'latent-heat': '/lab/latent-heat',
    '12-b4': '/lab/latent-heat',
    'sim-boyle-mariotte': '/lab/boyle-mariotte',
    'boyle-mariotte': '/lab/boyle-mariotte',
    '12-b7': '/lab/boyle-mariotte',
    'sim-electromagnetic-induction': '/lab/induction',
    'sim-induction': '/lab/induction',
    'induction': '/lab/induction',
    '12-b12': '/lab/induction',
    'workbench-universal': '/workbench/universal',
    'universal-workbench': '/workbench/universal',
  };

  if (ID_MAP[id]) {
    return ID_MAP[id];
  }

  // 3. Keyword / Title Matching (ordered from most specific to general)

  // Universal Workbench
  if (id.includes('workbench') || id.includes('sandbox') || t.includes('tự do') || t.includes('universal') || t.includes('sandbox')) {
    return '/workbench/universal';
  }

  // Sound Resonance (Bài 5 Lớp 11) - Check BEFORE wave interference!
  if (id.includes('sound-resonance') || id.includes('acoustic') || t.includes('ống cộng hưởng') || t.includes('truyền âm') || t.includes('cộng hưởng âm')) {
    return '/lab/sound-resonance';
  }

  // Wave / Young Double Slit Interference (Bài 12 Lớp 11)
  if (id.includes('young') || id.includes('interference') || t.includes('khe y-âng') || t.includes('khoảng vân') || t.includes('giao thoa ánh sáng') || t.includes('bước sóng ánh sáng')) {
    return '/lab/wave-interference';
  }

  // Speed Measurement (Bài 6 Lớp 10)
  if (id.includes('speed') || id.includes('toc-do') || t.includes('tốc độ') || t.includes('chuyển động thẳng') || t.includes('máng nghiêng')) {
    return '/lab/speed-measurement';
  }

  // Free Fall (Bài 14 Lớp 10)
  if (id.includes('free-fall') || id.includes('roi-tu-do') || t.includes('rơi tự do') || t.includes('gia tốc rơi')) {
    return '/lab/free-fall';
  }

  // Sliding Friction (Bài 21 Lớp 10)
  if (id.includes('friction') || id.includes('ma-sat') || t.includes('ma sát') || t.includes('hệ số ma sát')) {
    return '/lab/sliding-friction';
  }

  // Momentum Collision (Bài 30 Lớp 10)
  if (id.includes('momentum') || id.includes('dong-luong') || id.includes('va-cham') || t.includes('động lượng') || t.includes('va chạm')) {
    return '/lab/momentum-collision';
  }

  // Hooke Spring (Bài 38 Lớp 10)
  if (id.includes('spring') || id.includes('hooke') || id.includes('lo-xo') || t.includes('lò xo') || t.includes('hooke') || t.includes('độ giãn lò xo')) {
    return '/lab/spring-mass';
  }

  // Simple Pendulum (Bài 7 Lớp 11)
  if (id.includes('pendulum') || id.includes('con-lac-don') || t.includes('con lắc đơn') || t.includes('dao động con lắc')) {
    return '/lab/simple-pendulum';
  }

  // EMF & Internal Resistance (Bài 19 Lớp 11)
  if (id.includes('emf') || t.includes('suất điện động') || t.includes('điện trở trong')) {
    return '/lab/emf-internal-r';
  }

  // Refraction / Optics (Bài 21 Lớp 11)
  if (id.includes('refraction') || id.includes('khuc-xa') || t.includes('khúc xạ') || t.includes('chiết suất')) {
    return '/lab/refraction';
  }

  // Specific Heat (Bài 3 Lớp 12)
  if (id.includes('specific-heat') || t.includes('nhiệt dung riêng')) {
    return '/lab/specific-heat';
  }

  // Latent Heat (Bài 4 Lớp 12)
  if (id.includes('latent-heat') || t.includes('nhiệt nóng chảy') || t.includes('nước đá')) {
    return '/lab/latent-heat';
  }

  // Boyle Mariotte (Bài 7 Lớp 12)
  if (id.includes('boyle') || id.includes('dang-nhiet') || t.includes('đẳng nhiệt') || t.includes('boyle')) {
    return '/lab/boyle-mariotte';
  }

  // Electromagnetic Induction (Bài 12 Lớp 12)
  if (id.includes('induction') || id.includes('cam-ung') || t.includes('cảm ứng điện từ') || t.includes('từ trường')) {
    return '/lab/induction';
  }

  // DC Circuit / Ohm
  if (id.includes('dc-circuit') || id.includes('ohm') || t.includes('mạch điện') || t.includes('định luật ohm')) {
    return '/lab/dc-circuit';
  }

  return '/lab/dc-circuit';
};
