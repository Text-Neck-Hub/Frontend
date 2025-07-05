
import { Http } from '../types/Http'; 
export const getPostList = async () => await Http.get('/v1/posts');