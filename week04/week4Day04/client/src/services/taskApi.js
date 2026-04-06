import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
});

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
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
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = taskApi;
