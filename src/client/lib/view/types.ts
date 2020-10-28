import { SetStateRecord } from "../state/types";

export type View<T,E> = {
  render: SetStateRecord<T>
  elements: E
}