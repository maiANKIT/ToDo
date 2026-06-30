import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TodoCard from "../TodoCard/TodoCard";
import "./KanbanBoard.css";

const COLUMNS = [
  { key: "pending",    label: "Pending",     dot: "dot-pending"    },
  { key: "inprogress", label: "In Progress", dot: "dot-inprogress" },
  { key: "done",       label: "Done",        dot: "dot-done"       },
];

const KanbanBoard = ({
  todos,
  onEdit,
  onDelete,
  onToggleStar,
  onStatusChange,
  onViewDetails,
}) => {
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const colTodos = todos.filter((t) => t.status === col.key);
          return (
            <div className="kanban-column" key={col.key}>
              <div className="kanban-column-header">
                <span className={`pill-dot ${col.dot}`} />
                <span className="kanban-column-title">{col.label}</span>
                <span className="kanban-column-count">{colTodos.length}</span>
              </div>

              <Droppable droppableId={col.key}>
                {(provided, snapshot) => (
                  <div
                    className={`kanban-column-body ${
                      snapshot.isDraggingOver ? "kanban-column-body--over" : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {colTodos.length === 0 && !snapshot.isDraggingOver && (
                      <div className="kanban-empty-slot">Drop tasks here</div>
                    )}

                    {colTodos.map((todo, index) => (
                      <Draggable
                        draggableId={todo._id}
                        index={index}
                        key={todo._id}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`kanban-card-wrap ${
                              dragSnapshot.isDragging ? "kanban-card-wrap--dragging" : ""
                            }`}
                          >
                            <TodoCard
                              todo={todo}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onToggleStar={onToggleStar}
                              onStatusChange={onStatusChange}
                              onViewDetails={onViewDetails}
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