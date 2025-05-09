import {
  generateGanttTaskFromGitLab,
  updateGitLabDescriptionStringFromGanttTask,
} from './GitLabHelper';

const description = `\`\`\`yaml
start_date: 2021/2/5
progress: 0.5
parent: 5
\`\`\`

## 概要 
issueの内容
`;

const issue_info = {
  iid: 36,
  title: 'テストissueのタイトル',
  state: "opened",
  assignee: { name: 'satoshi' },
  due_date: new Date('2021/2/5'),
  description: description,
  updated_at:new Date('2021/2/5'),
  time_stats: {
    human_time_estimate: null
  },
};

const gantt_task = {
  id: '#36',
  links: [],
  text: 'テストissueのタイトル',
  state: "opened",
  dateless: false,
  start_date: '2021/2/5',
  due_date: new Date('2021/2/5'),
  duration: 1,
  progress: 0.5,
  assignee: 'satoshi',
  parent: '#5',
  _parent: '#5',
  description: description,
  update:'2021/2/5',
};

describe('have parent', () => {
  test('true', () => {
    expect(generateGanttTaskFromGitLab(issue_info)).toEqual(gantt_task);
  });
  test('true', () => {
    expect(
      updateGitLabDescriptionStringFromGanttTask(description, gantt_task)
    ).toEqual(description);
  });
});

const description_dont_have_parent = `\`\`\`yaml
start_date: 2021/2/5
progress: 0.5
\`\`\`

## 概要 
issueの内容
`;

const description_have_parent = `\`\`\`yaml
start_date: 2021/2/5
progress: 0.5
parent: 0
\`\`\`

## 概要 
issueの内容
`;

const issue_info_dont_have_parent = {
  iid: 36,
  title: 'テストissueのタイトル',
  state: "opened",
  assignee: { name: 'satoshi' },
  due_date: new Date('2021/2/5'),
  description: description_dont_have_parent,
  updated_at:new Date('2021/2/5'),
  time_stats: {
    human_time_estimate: null
  },
};

const gantt_task_have_parent = {
  id: '#36',
  text: 'テストissueのタイトル',
  state: "opened",
  dateless: false,
  start_date: '2021/2/5',
  due_date: new Date('2021/2/5'),
  duration: 1,
  progress: 0.5,
  assignee: 'satoshi',
  description: description_dont_have_parent,
  update:'2021/2/5',
  links:[],
  parent: "#0",
  _parent: "#0"
};

describe('have parent', () => {
  test('true', () => {
    expect(generateGanttTaskFromGitLab(issue_info_dont_have_parent)).toEqual(
      gantt_task_have_parent
    );
  });
  test('true', () => {
    expect(
      updateGitLabDescriptionStringFromGanttTask(
        description_dont_have_parent,
        gantt_task_have_parent
      )
    ).toEqual(description_have_parent);
  });
});
