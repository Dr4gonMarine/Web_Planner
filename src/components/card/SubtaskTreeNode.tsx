import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { StatusBadge } from '../shared/StatusBadge'
import { useUIStore } from '../../store/useUIStore'
import { SubtaskTree } from './SubtaskTree'
import type { CardTreeNode } from '../../types'

interface Props {
  node: CardTreeNode
  depth: number
}

export function SubtaskTreeNode({ node, depth }: Props) {
  const [expanded, setExpanded] = useState(true)
  const { setActiveCard } = useUIStore()
  const hasChildren = node.children.length > 0

  return (
    <li style={{ paddingLeft: depth * 16 }}>
      <div className="flex items-center gap-1.5 py-1 rounded px-1 hover:bg-muted/60 group">
        {hasChildren ? (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-muted-foreground flex-shrink-0"
          >
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        ) : (
          <span className="w-3.5 h-3.5 flex-shrink-0" />
        )}

        <span
          className="text-sm flex-1 cursor-pointer hover:underline truncate"
          onClick={() => setActiveCard(node.id)}
        >
          {node.title}
        </span>

        <StatusBadge status={node.status} />
      </div>

      {hasChildren && expanded && (
        <SubtaskTree nodes={node.children} depth={depth + 1} />
      )}
    </li>
  )
}
