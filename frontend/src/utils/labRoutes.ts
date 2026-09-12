/**
 * Centralized utility to resolve dedicated lab simulation routes based on lab ID or title.
 */
export const getLabRoute = (labId?: string, title?: string, fallback?: string): string => {
  const id = (labId || '').toLowerCase();
  const t = (title || '').toLowerCase();

  // Universal Workbench Sandbox
  if (id.includes('workbench') || id.includes('sandbox') || id.includes('tu-do') || t.includes('tự do') || t.includes('workbench')) {
    return '/workbench/universal';
  }

  // Pendulum
  if (id.includes('pendulum') || id.includes('con-lac-don') || id === 'lab-6' || t.includes('con lắc đơn')) {
    return '/lab/simple-pendulum';
  }

  // Spring / Mass / Hooke
  if (
    id.includes('spring') ||
    id.includes('hooke') ||
    id.includes('lo-xo') ||
    t.includes('lò xo') ||
    t.includes('spring')
  ) {
    return '/lab/spring-mass';
  }

  // EMF & Internal Resistance
  if (
    id.includes('emf') ||
    id === 'lab-3' ||
    t.includes('suất điện động') ||
    t.includes('điện trở trong')
  ) {
    return '/lab/emf-internal-r';
  }

  // Refraction / Optics
  if (
    id.includes('refraction') ||
    id.includes('khuc-xa') ||
    id === 'lab-5' ||
    t.includes('khúc xạ') ||
    t.includes('thấu kính')
  ) {
    return '/lab/refraction';
  }

  // Free Fall
  if (
    id.includes('free-fall') ||
    id.includes('roi-tu-do') ||
    id === 'lab-2' ||
    t.includes('rơi tự do')
  ) {
    return '/lab/free-fall';
  }

  // PhET Vietnam Ohm
  if (id.includes('ohm-vietnam') || id.includes('phet-vietnam')) {
    return '/lab/ohm-vietnam';
  }

  // Sound / Acoustic Resonance
  if (
    id.includes('sound-resonance') ||
    id.includes('acoustic') ||
    id === '11-b5' ||
    id === 'sim-sound-resonance' ||
    t.includes('cộng hưởng') ||
    t.includes('truyền âm')
  ) {
    return '/lab/sound-resonance';
  }

  // Wave / Sound / Specific Heat
  if (
    id.includes('wave') ||
    id.includes('sound') ||
    id.includes('interference') ||
    id.includes('heat') ||
    id === 'lab-4' ||
    t.includes('giao thoa') ||
    t.includes('sóng') ||
    t.includes('nhiệt dung')
  ) {
    return '/lab/wave-interference';
  }

  // DC Circuit / Ohm
  if (
    id.includes('dc-circuit') ||
    id.includes('ohm') ||
    id === 'lab-1' ||
    t.includes('mạch điện') ||
    t.includes('định luật ohm')
  ) {
    return '/lab/dc-circuit';
  }

  // Default fallback if specified and valid, otherwise fallback to dc-circuit
  if (fallback && fallback !== '/simulation') {
    return fallback;
  }

  return '/lab/dc-circuit';
};
