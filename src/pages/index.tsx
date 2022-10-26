import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";


const Home: NextPage = () => {
  const utils = trpc.useContext();
  const [snippetText, setSnippetText] = useState("");
  const [allSnippetsText, setAllSnippetsText] = useState([]);
  const router = useRouter();


  
  const createSnippet = trpc.snippet.saveSnippet.useMutation({
    async onMutate(newItem) {
      utils.snippet.getAllSnippets.cancel();
      const prevData = utils.snippet.getAllSnippets.getData();
      utils.snippet.getAllSnippets.setData([ ...prevData, newItem ]);
      return { prevData };
    },
    onError(err, thing, ctx) {
      // utils.snippet.getAllSnippets.setData(ctx.prevData);
      // some error message
    },
    async onSettled() {
      // Sync with server once mutation has settled
     await utils.snippet.getAllSnippets.invalidate();
    },
  });

  const allSnippets = trpc.snippet.getAllSnippets.useQuery();
  
  const deleteSnippet = trpc.snippet.deleteSnippet.
  useMutation({
    async onMutate(deletedItem) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.snippet.getAllSnippets.cancel();
      // Get the data from the queryCache
      const prevData = utils.snippet.getAllSnippets.getData();
      // Optimistically update the data with our new post
      utils.snippet.getAllSnippets.setData(prevData?.filter(item => item.id !== deletedItem.id));
      // Return the previous data so we can revert if something goes wrong
      return { prevData }; 
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.snippet.getAllSnippets.setData(ctx.prevData);
      // some error message
    },
    async onSettled() {
      // Sync with server once mutation has settled
     await utils.snippet.getAllSnippets.invalidate();
    },
  });


  const handleSaveSnippet = async () => {
    const newSnippet = await createSnippet.mutateAsync({ text: snippetText });
    console.table(newSnippet);
    // router.push(`/snippets/${newSnippet.id}`);
  }

  const handleCopy = (copiedText: string) => {
    if (!copiedText) return;
    navigator.clipboard.writeText(copiedText)
  }

  const handleDelete = (snippetId: string) => {
    deleteSnippet.mutateAsync({ id: snippetId })
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-4xl font-bold">Paste Bin Clone</h1>
        <p> Paste in a snippet of text </p>
        <textarea 
          onChange={(e) => setSnippetText(e.target.value)} 
          className="border shadow-md rounded m-3 p-2 w-1/3 h-48"
          value={snippetText}  
        />
        <button 
          className="p-2 rounded text-white bg-blue-500 hover:bg-blue-400"
          onClick={handleSaveSnippet}
        >
          Save
        </button>
        <h3
          className="mt-4 mb-3 text-2xl font-bold"
        >
          All Snippets 
        </h3>
        <div
          className="flex flex-col"
        >
          {allSnippets.data?.map((snippet) => (
            <div key={snippet.id} className="flex">
              <textarea
                className="border shadow-md rounded m-3 p-2 w-30 h-20"
                disabled
                value={snippet.text}
                onClick={()=>router.push(`/snippets/${snippet.id}`)}
              />
              <div>
              <button
                onClick={() => handleCopy(snippet.text)}
                className="mt-5 flex"
              >COPPY!</button>
              <button
                onClick={() => router.push(`/snippets/${snippet.id}`)}
              >View Snippet</button>
              <button onClick={() => handleDelete(snippet.id)}>Delete</button>
              </div>
            </div>
            
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
