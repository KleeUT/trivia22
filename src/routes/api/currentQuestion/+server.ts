import { RequestEvent } from "@sveltejs/kit";
import { CurrentQuestion } from "../../../types";



export async function GET({request, platform}:RequestEvent) : Promise<Response> {
	try{
		const v = await platform.env?.QUESTION_STORE.get('currentQuestion');
		if(!v){
			return new Response(JSON.stringify({err: {message: "No current question"}}),{status:404})
		}
		const question = JSON.parse(v) as CurrentQuestion;
		return new Response(JSON.stringify({data:{currentQuestion: question}}), { status: 200 });
	}catch(e){
		const err = e as Error;
		return new Response(JSON.stringify({err: {message:err.message, stack:err.stack}}), {status:500})
	}
};
