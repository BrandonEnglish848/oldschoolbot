import { Task } from 'klasa';

import { MinigameTickerTaskData } from '../../../lib/types/minions';
import runActivityTask from '../../../lib/util/runActivityTask';
import { Tasks } from '../../../lib/constants';
import removeSubTasksFromActivityTask from '../../../lib/util/removeSubTasksFromActivityTask';
import { taskNameFromType } from '../../../lib/util/taskNameFromType';

export default class extends Task {
	async run(data: MinigameTickerTaskData) {
		const now = Date.now();
		const tasksThatWereFinished: number[] = [];

		for (const minigameTaskData of data.subTasks) {
			// If the current task being checked finishes past now, break.
			if (minigameTaskData.finishDate > now) break;

			await runActivityTask(
				this.client,
				taskNameFromType(minigameTaskData.type),
				minigameTaskData
			);

			tasksThatWereFinished.push(minigameTaskData.id);
		}

		if (tasksThatWereFinished.length === 0) return;

		await removeSubTasksFromActivityTask(
			this.client,
			Tasks.MinigameTicker,
			tasksThatWereFinished
		);
	}
}
