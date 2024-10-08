<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { toast } from 'svelte-sonner';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateAgenceSchema } from '$lib/schema/agenciesSchema';

	import { goto } from '$app/navigation';

	let { data } = $props();

	const updateAgenceForm = superForm(data.updateAgence, {
		validators: zodClient(updateAgenceSchema),
		id: 'updateAgenceForm'
	});

	const {
		form: updateAgenceData,
		enhance: updateAgenceEnhance,
		message: updateAgenceMessage
	} = updateAgenceForm;

	let agenceSuggestions: string[] = $state([]);
	let timeoutId: ReturnType<typeof setTimeout>;
	let selectedDirectorName = $state('Select a directors');

	const fetchagenceSuggestions = async (query: string) => {
		if (query.length < 3) {
			agenceSuggestions = [];
			return;
		}

		try {
			const response = await fetch(`/api/open-cage-data?q=${encodeURIComponent(query)}`);
			const data = await response.json();
			agenceSuggestions = data;
		} catch (error) {
			console.error('Error fetching address suggestions:', error);
		}
	};

	const selectSuggestion = (suggestion: any) => {
		const { house_number, road, city, town, village, state, postcode, country } =
			suggestion.components;
		$updateAgenceData.street = `${house_number || ''} ${road || ''}`.trim();
		$updateAgenceData.city = city || town || village || '';
		$updateAgenceData.state = state || '';
		$updateAgenceData.zip = postcode || '';
		$updateAgenceData.country = country || '';
		agenceSuggestions = [];
	};

	$effect(() => {
		if ($updateAgenceMessage === 'Agence updated successfully') {
			toast.success($updateAgenceMessage);
			setTimeout(() => goto('/agencies'), 0);
		}

		let directorId = $updateAgenceData.directorId;

		let selectedDirector = data.directors.find((directors) => directors.id === directorId);

		selectedDirectorName = selectedDirector ? selectedDirector.name : 'Director not found';
	});

	const selectDirector = (directors: any) => {
		selectedDirectorName = directors.name;
		$updateAgenceData.directorId = directors.id;
	};

	const handleInput = (event: Event) => {
		const input = event.target as HTMLInputElement;
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fetchagenceSuggestions(input.value);
		}, 1000);
	};
</script>

<div class="max-w-lg mx-auto mt-8">
	<h1 class="text-2xl font-bold mb-4">Create a New Agence</h1>

	{#if agenceSuggestions}
		<h2>Suggestions:</h2>
		<ul class="rounded border p-2">
			{#each agenceSuggestions.results as suggestion}
				<li>
					<button
						class="cursor-pointer"
						onclick={() => selectSuggestion(suggestion)}
						onkeydown={(event) => event.code === 'Enter' && selectSuggestion(suggestion)}
					>
						{suggestion.formatted}
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	<form method="POST" action="?/update" use:updateAgenceEnhance>
		<div class="mb-4">
			<Form.Field name="street" form={updateAgenceForm}>
				<Form.Control let:attrs>
					<Form.Label>Street</Form.Label>
					<Input
						oninput={handleInput}
						{...attrs}
						type="text"
						bind:value={$updateAgenceData.street}
						required
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="mb-4">
			<Form.Field name="city" form={updateAgenceForm}>
				<Form.Control let:attrs>
					<Form.Label>City</Form.Label>
					<Input
						oninput={handleInput}
						{...attrs}
						type="text"
						bind:value={$updateAgenceData.city}
						required
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="mb-4">
			<Form.Field name="state" form={updateAgenceForm}>
				<Form.Control let:attrs>
					<Form.Label>State</Form.Label>
					<Input
						oninput={handleInput}
						{...attrs}
						type="text"
						bind:value={$updateAgenceData.state}
						required
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="mb-4">
			<Form.Field name="zip" form={updateAgenceForm}>
				<Form.Control let:attrs>
					<Form.Label>ZIP Code</Form.Label>
					<Input
						oninput={handleInput}
						{...attrs}
						type="text"
						bind:value={$updateAgenceData.zip}
						required
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="mb-4">
			<Form.Field name="country" form={updateAgenceForm}>
				<Form.Control let:attrs>
					<Form.Label>Country</Form.Label>
					<Input
						oninput={handleInput}
						{...attrs}
						type="text"
						bind:value={$updateAgenceData.country}
						required
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="mb-4">
			<Form.Field name="directorId" form={updateAgenceForm}>
				<Form.Control let:attrs>
					<Form.Label>Director</Form.Label>
					<Popover.Root>
						<Popover.Trigger class="border rounded px-4 py-2">
							{selectedDirectorName}
						</Popover.Trigger>
						<Popover.Content>
							<div class="flex flex-col space-y-2">
								{#each data.directors as directors}
									<button
										class="text-left hover:bg-gray-100 p-2 rounded"
										onclick={() => selectDirector(directors)}
									>
										{directors.name}
									</button>
								{/each}
							</div>
						</Popover.Content>
					</Popover.Root>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<input hidden name="directorId" bind:value={$updateAgenceData.directorId} />
		<input hidden name="id" bind:value={$updateAgenceData.id} />

		<div class="mt-6">
			<Button type="submit">Create Agence</Button>
		</div>
	</form>
</div>
