import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TodoCard from "../TodoCard/TodoCard";
import { STATUS_KEYS } from "../../utils/taskEnums";
import "./KanbanBoard.css";

const COLUMNS = [
  { key: "pending",    label: "Pending",     dot: "dot-pending"    },
  { key: "inprogress", label: "In Progress", dot: "dot-inprogress" },
  { key: "done",       label: "Done",        dot: "dot-done"       },
];

const FULL_PERMISSIONS = { canCreate: true, canEdit: true, canDelete: true };

const KanbanBoard = ({
  todos,
  onEdit,
  onDelete,
  onToggleStar,
  onStatusChange,
  onViewDetails,
  onDuplicate,
  permissions = FULL_PERMISSIONS,
}) => {
  // Dragging between columns changes status — same permission that
  // gates the status-badge click and swipe-to-done on TodoCard.
  const canEdit = permissions.canEdit ?? true;

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    if (!canEdit) return; // defense in depth — draggable is already disabled below
    onStatusChange(draggableId, STATUS_KEYS[destination.droppableId]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const colTodos = todos.filter((t) => t.status === STATUS_KEYS[col.key]);
          return (
            <div className="kanban-column" key={col.key}>
              <div className="kanban-column-header">
                <span className={`pill-dot ${col.dot}`} />
                <span className="kanban-column-title">{col.label}</span>
                <span className="kanban-column-count">{colTodos.length}</span>
              </div>

              <Droppable droppableId={col.key} isDropDisabled={!canEdit}>
                {(provided, snapshot) => (
                  <div
                    className={`kanban-column-body ${
                      snapshot.isDraggingOver ? "kanban-column-body--over" : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {colTodos.length === 0 && !snapshot.isDraggingOver && (
                      <div className="kanban-empty-slot">
                        {canEdit ? "Drop tasks here" : "No tasks"}
                      </div>
                    )}

                    {colTodos.map((todo, index) => (
                      <Draggable
                        draggableId={todo._id}
                        index={index}
                        key={todo._id}
                        isDragDisabled={!canEdit}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`kanban-card-wrap ${
                              dragSnapshot.isDragging ? "kanban-card-wrap--dragging" : ""
                            } ${!canEdit ? "kanban-card-wrap--locked" : ""}`}
                          >
                            <TodoCard
                              todo={todo}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onToggleStar={onToggleStar}
                              onStatusChange={onStatusChange}
                              onViewDetails={onViewDetails}
                              onDuplicate={onDuplicate}
                              permissions={permissions}
                              isKanban
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;