import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io } from 'socket.io-client';

const socket = io('https://week4-day4-backend.vercel.app');

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://week4-day4-backend.vercel.app' }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => '/tasks',
      providesTags: ['Task'],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          // Wait for the initial query to resolve
          await cacheDataLoaded;

          const handleTaskAdded = (newTask) => {
            updateCachedData((draft) => {
              if (!draft.find(t => t.id === newTask.id)) {
                draft.push(newTask);
              }
            });
          };

          const handleTaskUpdated = (updatedTask) => {
            updateCachedData((draft) => {
              const index = draft.findIndex((t) => t.id === updatedTask.id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...updatedTask };
              }
            });
          };

          const handleTaskDeleted = (taskId) => {
            updateCachedData((draft) => {
              return draft.filter((t) => t.id !== taskId);
            });
          };

          socket.on('task-added', handleTaskAdded);
          socket.on('task-updated', handleTaskUpdated);
          socket.on('task-deleted', handleTaskDeleted);

        } catch {
          // No-op
        }
        // cacheEntryRemoved will resolve when the cache entry is no longer needed
        await cacheEntryRemoved;
        socket.off('task-added');
        socket.off('task-updated');
        socket.off('task-deleted');
      },
    }),
    addTask: builder.mutation({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      // We don't need invalidatesTags here because Socket.IO handles the update
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = taskApi;
