'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import ReactQuill, { ReactQuillProps, Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Id } from '../../../../convex/_generated/dataModel';
import Delta from 'quill-delta';
import DocumentInfo from './documentInfo';

type Props = {
	params: {
		id: string;
	};
};

type QuillChange = ReactQuillProps['onChange'];

export default function Home({ params }: Props) {
	const [value, setValue] = useState('');

	const changeMutation = useMutation(api.changes.addChange);

	const changes = useQuery(api.changes.getChangesForDocument, {
		documentId: params.id as Id<'document'>,
	});

	const deltas = changes?.reduce((prev, cur) => {
		return prev.compose(JSON.parse(cur.change));
	}, new Delta());

	const document = useQuery(api.documents.getDocumentById, {
		documentId: params.id as Id<'document'>,
	});

	if (!document) {
		return <div>No Document Found</div>;
	}

	const onChange: QuillChange = (value, delta, source, editor) => {
		if (source !== 'user') {
			return;
		}

		setValue(value);
		changeMutation({
			change: JSON.stringify(delta),
			documentId: params.id as Id<'document'>,
			editor: 'Funny Frog',
		});
	};

	return (
		<div>
			<h4 className="text-sm font-medium leading-none m-4">
				<DocumentInfo document={document} />
			</h4>

			{/* @ts-ignore */}
			<ReactQuill theme="snow" value={deltas} onChange={onChange} />
		</div>
	);
}
