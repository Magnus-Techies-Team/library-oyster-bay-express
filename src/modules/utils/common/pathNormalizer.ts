export default function pathNormalizer(path: string) {
  return path.replace(/\\+/g, "/").replace(/\/+/g, "/");
}
