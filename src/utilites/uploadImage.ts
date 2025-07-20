import { supabase } from '@/lib/supabase'

export async function uploadImage(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage
        .from('updates') // bucket adı
        .upload(fileName, file)

    if (error) {
        console.error('Upload error:', error.message)
        return null
    }

    const { data: publicUrlData } = supabase
        .storage
        .from('updates')
        .getPublicUrl(fileName)

    return publicUrlData?.publicUrl || null
}
