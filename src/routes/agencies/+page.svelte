<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';
	import { toast } from 'svelte-sonner';

	import { deleteAgenceSchema } from '$lib/schema/agenciesSchema.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import DirectorBadge from '$lib/components/DirectorBadge.svelte';

	let { data } = $props();

	const deleteAgenceForm = superForm(data.deleteAgence, {
		validators: zodClient(deleteAgenceSchema),
		id: 'deleteAgenceForm'
	});

	const { enhance: deleteAgenceEnhance, message: deleteAgenceMessage } = deleteAgenceForm;

	$effect(() => {
		if ($deleteAgenceMessage === 'Agence deleted successfully') {
			toast.success($deleteAgenceMessage);
		}
	});
</script>

<div class="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
	<div class="space-y-6 rounded-md border p-4">
		<div class="flex justify-between">
			<h1>Agencies</h1>
			<a href="agencies/create">
				<Button variant="outline">
					<svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v2H5v14h14v-5z"
						/><path fill="currentColor" d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4z" /></svg
					>
				</Button>
			</a>
		</div>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Street</Table.Head>
					<Table.Head>City</Table.Head>
					<Table.Head>State</Table.Head>
					<Table.Head>ZIP</Table.Head>
					<Table.Head>Country</Table.Head>
					<Table.Head>Director</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.agencies as agence (agence.id)}
					<Table.Row>
						<Table.Cell>{agence.street}</Table.Cell>
						<Table.Cell>{agence.city}</Table.Cell>
						<Table.Cell>{agence.state}</Table.Cell>
						<Table.Cell>{agence.zip}</Table.Cell>
						<Table.Cell>{agence.country}</Table.Cell>
						<Table.Cell>
							<DirectorBadge director={agence.director} />
						</Table.Cell>
						<Table.Cell>
							<div class="flex justify-end">
								<div class="m-2">
									<form method="POST" action="?/delete" use:deleteAgenceEnhance>
										<input type="hidden" name="id" value={agence.id} />
										<Button type="submit" variant="outline">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="15px"
												height="15px"
												viewBox="0 0 1024 1024"
												><path
													fill="currentColor"
													d="M360 184h-8c4.4 0 8-3.6 8-8zh304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32M731.3 840H292.7l-24.2-512h487z"
												/></svg
											>
										</Button>
									</form>
								</div>
								<div class="m-2">
									<a href="agencies/{agence.id}">
										<Button variant="outline">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="15px"
												height="15px"
												viewBox="0 0 24 24"
												><path
													fill="currentColor"
													d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"
												/></svg
											>
										</Button>
									</a>
								</div>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
