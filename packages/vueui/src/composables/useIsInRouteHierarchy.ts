import { computed } from 'vue';
import { useRoute } from 'vue-router';

function isPathPrefix(prefix: string, path: string): boolean {
  if (prefix === path) return true;
  const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
  const prefixNorm = prefix.endsWith('/') ? prefix : prefix + '/';
  return normalized === prefix || normalized.startsWith(prefixNorm);
}

export function useIsInRouteHierarchy(path: string) {
  const route = useRoute();
  return computed(() => {
    const current = route.path;
    if (path === '/editor') {
      return current === '/' || isPathPrefix('/editor', current);
    }
    return isPathPrefix(path, current);
  });
}
