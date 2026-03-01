import type { CardTreeNode } from '../../types'
import { SubtaskTreeNode } from './SubtaskTreeNode'

interface Props {
  nodes: CardTreeNode[]
  depth?: number
}

export function SubtaskTree({ nodes, depth = 0 }: Props) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => (
        <SubtaskTreeNode key={node.id} node={node} depth={depth} />
      ))}
    </ul>
  )
}
