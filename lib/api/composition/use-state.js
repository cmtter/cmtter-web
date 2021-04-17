import useStore from './use-store'
export default function (nameSpace) {
  const sotre = useStore()
  return sotre.state[nameSpace]
}