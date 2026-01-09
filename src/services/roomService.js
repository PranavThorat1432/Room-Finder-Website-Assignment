import { supabase } from './supabase/config';

export const getRooms = async (filters = {}) => {
  let query = supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  if (filters.owner_id) {
    query = query.eq('owner_id', filters.owner_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }

  return data || [];
};

export const getRoomById = async (id) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching room:', error);
    throw error;
  }

  return data;
};

export const createRoom = async (roomData) => {
  const { data, error } = await supabase
    .from('rooms')
    .insert([roomData])
    .select();

  if (error) {
    console.error('Error creating room:', error);
    throw error;
  }

  return data?.[0];
};

export const updateRoom = async (roomId, updates) => {
  const { error } = await supabase
    .from("rooms")
    .update(updates)
    .eq("id", roomId);

  if (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};


export const uploadRoomImage = async (file, roomId) => {

  const fileExt = file.name.split('.').pop();
  const fileName = `${roomId}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("room-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: publicData } = supabase.storage
    .from("room-images")
    .getPublicUrl(fileName);


  return publicData.publicUrl;
};


export const deleteRoom = async (roomId) => {

  const { data, error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId)
    .select()
    .single();

  if (error) {
    console.error('Error deleting room. Full error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }

  return data;
};


export const getMyListings = (userId) => getRooms({ owner_id: userId });
export const addRoomListing = createRoom;
