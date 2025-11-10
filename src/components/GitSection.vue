<template>
	<section class="k-section area-git-changes-list">
		<header class="k-section-header">
			<k-headline>{{ finalHeadline }}</k-headline>
			<k-button-group v-if="list.length">
				<k-button icon="share" :link="link">Open</k-button>
			</k-button-group>
		</header>

		<k-items v-if="list.length" :items="list" />
		<template v-else>
			<k-empty icon="check">No changes</k-empty>
		</template>
	</section>
</template>

<script>
const UPDATE_EVENTS = [
	"site.changeTitle",
	"page.changeTitle",
	"page.changeStatus",
	"model.update",
];

function getStats() {
	return {
		total: 0,
		added: 0,
		untracked: 0,
		modified: 0,
		renamed: 0,
		deleted: 0,
	};
}

export default {
	data: () => {
		return {
			headline: null,
			stats: getStats(),
		};
	},
	computed: {
		finalHeadline() {
			let text = this.headline;

			if (this.stats.total) {
				text += ` (${this.stats.total} changes)`;
			}

			return text;
		},
		link() {
			return this.$panel.url();
		},
		positiveStatus() {
			let text = [];

			if (this.stats.added) {
				text.push(`${this.stats.added} added`);
			}

			if (this.stats.untracked) {
				text.push(`${this.stats.untracked} untracked`);
			}

			if (text.length) {
				return text.join(", ");
			} else {
				return null;
			}
		},
		noticeStatus() {
			let text = [];

			if (this.stats.modified) {
				text.push(`${this.stats.modified} modified`);
			}

			if (this.stats.renamed) {
				text.push(`${this.stats.renamed} renamed`);
			}

			if (text.length) {
				return text.join(", ");
			} else {
				return null;
			}
		},
		negativeStatus() {
			if (this.stats.deleted) {
				return `${this.stats.deleted} deleted`;
			} else {
				return null;
			}
		},
		list() {
			let result = [];

			if (this.positiveStatus) {
				result.push({
					text: this.positiveStatus,
					image: {
						icon: "copy",
						back: "var(--color-positive)",
						color: "var(--color-gray-800)",
					},
				});
			}

			if (this.noticeStatus) {
				result.push({
					text: this.noticeStatus,
					image: {
						icon: "edit",
						back: "var(--color-notice)",
						color: "var(--color-gray-800)",
					},
				});
			}

			if (this.negativeStatus) {
				result.push({
					text: this.negativeStatus,
					image: {
						icon: "trash",
						back: "var(--color-negative)",
						color: "var(--color-gray-800)",
					},
				});
			}

			return result.map((result) => ({
				...result,
				key: result.image.icon,
			}));
		},
	},
	created() {
		this.load().then((response) => {
			this.headline = response.headline;
			this.status();
		});

		UPDATE_EVENTS.forEach((e) => this.$events.$on(e, this.status));
	},
	destroyed() {
		UPDATE_EVENTS.forEach((e) => this.$events.$off(e, this.status));
	},
	methods: {
		status() {
			this.$api.get("git/status").then((entries) => {
				this.stats = getStats();

				if (entries.length) {
					this.updateStats(entries);
				}
			});
		},
		updateStats(entries) {
			this.stats.total = entries.length;

			entries.forEach((entry) => {
				let status = entry.staged || entry.unstaged;

				switch (status) {
					case "A":
						this.stats.added++;
						break;
					case "?":
						this.stats.untracked++;
						break;
					case "M":
						this.stats.modified++;
						break;
					case "R":
						this.stats.renamed++;
						break;
					case "D":
						this.stats.deleted++;
				}
			});
		},
	},
};
</script>
