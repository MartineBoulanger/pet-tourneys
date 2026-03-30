'use client';

import { useState, useEffect } from 'react';
import { toastError, toastSuccess } from '@/utils/toast';
import { UseManagerOptions } from '@/types/hooks.types';

export function useCMSManager<
  T extends { id: string; isvisible?: boolean | null },
>({
  fetchFn,
  deleteFn,
  reorderFn,
  deleteConfirmMessage = 'Are you sure you want to delete this item?',
  visibilityActions,
  exclusiveVisibility = false,
}: UseManagerOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<T | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingVisibility, setTogglingVisibility] = useState<string | null>(
    null,
  );
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const result = await fetchFn();
      if (result.success) {
        setItems(result.data || []);
      } else {
        console.error('Error loading items:', result.error);
        toastError(result.error || 'Error loading items');
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading items:', (error as Error).message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(undefined);
    loadItems();
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(deleteConfirmMessage)) return;
    setDeletingId(id);
    try {
      const result = await deleteFn(id);
      if (result.success) {
        await loadItems();
        toastSuccess('Successfully deleted item');
      } else {
        toastError(result.error || 'Error during deleting');
      }
    } catch (error) {
      console.error((error as Error).message);
      toastError('An unexpected error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (item: T) => {
    if (!visibilityActions) return;
    setTogglingVisibility(item.id);
    try {
      let result;
      if (item.isvisible) {
        result = await visibilityActions.hide(item.id);
        if (result.success) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, isvisible: false } : i,
            ),
          );
        }
      } else {
        result = await visibilityActions.show(item.id);
        if (result.success) {
          setItems((prev) =>
            prev.map((i) =>
              exclusiveVisibility
                ? { ...i, isvisible: i.id === item.id }
                : i.id === item.id
                  ? { ...i, isvisible: true }
                  : i,
            ),
          );
          toastSuccess('Successfully updated visibility');
        }
      }
      if (!result.success) {
        toastError(result.error || 'Error updating visibility');
      }
    } catch (error) {
      console.error('Error toggling visibility:', (error as Error).message);
      toastError('An unexpected error occurred');
    } finally {
      setTogglingVisibility(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragDrop = async (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === id) {
      setDraggedItem(null);
      return;
    }
    const draggedIndex = items.findIndex((i) => i.id === draggedItem);
    const targetIndex = items.findIndex((i) => i.id === id);
    if (draggedIndex === -1 || targetIndex === -1) return;
    const newItems = [...items];
    const dragged = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, dragged);
    setItems(newItems);
    const itemIds = newItems.map((i) => i.id);
    try {
      await reorderFn?.(itemIds);
    } catch (error) {
      console.error('Error reordering items:', (error as Error).message);
      toastError('An unexpected error occurred');
      await loadItems();
    }
    setDraggedItem(null);
  };

  return {
    items,
    loading,
    showForm,
    setShowForm,
    editingItem,
    deletingId,
    togglingVisibility,
    draggedItem,
    handleFormSuccess,
    handleEdit,
    handleCancelForm,
    handleDelete,
    handleToggleVisibility,
    handleDragStart,
    handleDragOver,
    handleDragDrop,
  };
}
