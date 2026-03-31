'use client';

import { useEffect, useState } from 'react';
import { PetsToolbar } from './Toolbar';
import { PetsLayout } from './Layout';
import { PetModal } from './Modal';
import { PetEditModal } from './PetEditModal';
import { Pagination } from './Pagination';
import { Pet, PetsManagerProps } from '@/types/supabase.types';
import { getPets } from '@/actions/supabase/pets-schema/pets/getPets';
import {
  deletePet,
  deletePets,
} from '@/actions/supabase/pets-schema/pets/deletePets';
import { useRouter } from 'next/navigation';

export function PetsManager({ initialPets, path }: PetsManagerProps) {
  const [pets, setPets] = useState<Pet[]>(initialPets || []);
  const [selected, setSelected] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewing, setViewing] = useState<Pet | null>(null);
  const [editing, setEditing] = useState<Pet | null>(null);
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch pets when page or pageSize changes
  useEffect(() => {
    const fetchPets = async (page: number, size: number) => {
      setLoading(true);
      const result = await getPets(page, size);
      if (result.success) {
        setPets(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalItems(result.count || 0);
      }
      setLoading(false);
    };
    fetchPets(currentPage, pageSize);
  }, [currentPage, pageSize]);
  // TODO: check why the page does not refresh after editing a pet, even though the data is updated in the database. Maybe we need to revalidate the path after editing a pet? - did that, seek other option
  const refreshPets = async () => {
    const result = await getPets(pageSize, currentPage, path);
    if (result.success) {
      const data = result && result.data ? result.data : [];
      setPets(data);
      router.refresh();
    }
  };

  const handleDelete = async (petId: number) => {
    const result = await deletePet(petId, path);
    if (result.success) {
      setPets((prev) => prev.filter((pet) => pet.id !== petId));
    }
  };

  const handleBulkDelete = async (petIds: number[]) => {
    const result = await deletePets(petIds, path);
    if (result.success) {
      setPets((prev) => prev.filter((pet) => !petIds.includes(pet.id)));
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditing(pet);
  };

  const handleEditSuccess = () => {
    setEditing(null);
    refreshPets();
  };

  const handleView = (pet: Pet) => {
    setViewing(pet);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelected([]); // Clear selection when changing pages
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
    setSelected([]);
  };

  return (
    <>
      <PetsToolbar
        pets={pets}
        setPets={setPets}
        selected={selected}
        setSelected={setSelected}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onBulkDelete={handleBulkDelete}
      />
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-humanoid'></div>
        </div>
      ) : (
        <>
          <PetsLayout
            pets={pets}
            selected={selected}
            setSelected={setSelected}
            viewMode={viewMode}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {pets.length >= pageSize && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              totalItems={totalItems}
            />
          )}
        </>
      )}
      {viewing && (
        <PetModal
          pet={viewing}
          onClose={() => setViewing(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {editing && (
        <PetEditModal
          pet={editing}
          onClose={() => setEditing(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
