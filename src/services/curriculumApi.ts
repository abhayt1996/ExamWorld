import { API_BASE_URL } from './authApi';

export async function fetchLiveCurriculum() {
  const res = await fetch(`${API_BASE_URL}/api/curriculum`);
  if (!res.ok) throw new Error('Failed to fetch curriculum');
  return res.json();
}

export async function seedDatabaseCurriculum(curriculumData: any) {
  const res = await fetch(`${API_BASE_URL}/api/admin/curriculum/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(curriculumData),
  });
  if (!res.ok) throw new Error('Failed to seed curriculum');
  return res.json();
}

export async function createSubjectApi(payload: any) {
  const res = await fetch(`${API_BASE_URL}/api/admin/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create subject');
  return res.json();
}

export async function updateSubjectApi(subjectId: string, updated: any) {
  const res = await fetch(`${API_BASE_URL}/api/admin/subjects/${subjectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error('Failed to update subject');
  return res.json();
}

export async function deleteSubjectApi(subjectId: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/subjects/${subjectId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete subject');
  return res.json();
}

export async function createTopicApi(payload: any) {
  const res = await fetch(`${API_BASE_URL}/api/admin/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create topic');
  return res.json();
}

export async function updateTopicApi(topicId: string, updated: any) {
  const res = await fetch(`${API_BASE_URL}/api/admin/topics/${topicId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error('Failed to update topic');
  return res.json();
}

export async function deleteTopicApi(topicId: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/topics/${topicId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete topic');
  return res.json();
}

export async function toggleEntityVisibility(type: string, id: string, is_active: boolean) {
  const res = await fetch(`${API_BASE_URL}/api/admin/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    // Match Python backend schema exactly:
    body: JSON.stringify({ entity_type: type, entity_id: id, is_active }), 
  });
  if (!res.ok) throw new Error('Failed to toggle visibility');
  return res.json();
}

export async function fetchAdminGraphData() {
  const res = await fetch(`${API_BASE_URL}/api/admin/graphs`);
  if (!res.ok) throw new Error('Failed to fetch graph data');
  return res.json();
}

export async function submitTestAttempt(payload: any) {
  const res = await fetch(`${API_BASE_URL}/api/student/tests/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit test');
  return res.json();
}

export async function getAdminAnalytics() {
  const res = await fetch(`${API_BASE_URL}/api/admin/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function getLiveLeaderboard(
  classFilter: string = 'All',
  timeRange: string = 'week'
) {
  const params = new URLSearchParams({
    class_filter: classFilter,
    time_range: timeRange,
  });
  const res = await fetch(`${API_BASE_URL}/api/leaderboard?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}
