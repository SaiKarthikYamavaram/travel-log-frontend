import React, { useState } from "react";
import { createLogEntry } from "../API";
import { useForm } from "react-hook-form";

export default function LogEntry({ location, onClose }) {
	const { register, handleSubmit } = useForm();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const onSubmit = async (data) => {
		try {
			setLoading(true);
			data.latitude = location.latitude;
			data.longitude = location.longitude;

			const created = await createLogEntry(data);
			console.log(created);
			onClose();
		} catch (error) {
			console.log(error);
            setError(error.message);
			setLoading(false);
            
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='entry-form'>
			{error && <h3 className='error'>{error}</h3>}
			<label htmlFor='apiKey'>API KEY </label>
			<input name='apiKey' required type='text' ref={register} />
			<label htmlFor='title'>Title</label>
			<input name='title' required type='text' ref={register} />
			<label htmlFor='comments'>Comments</label>
			<textarea name='comments' rows={4} ref={register} />
			<label htmlFor='description'>Description</label>
			<textarea name='description' rows={4} ref={register} />
			<label htmlFor='image'>Image</label>
			<input name='image' type='text' ref={register} />
			<label htmlFor='visitedDate'>Visit Date</label>
			<input name='visitedDate' type='date' required ref={register} />
			<button disabled={loading}>
				{loading ? "Loading..." : "Create Entry"}
			</button>
		</form>
	);
}
