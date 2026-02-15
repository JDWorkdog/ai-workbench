# Claude Code Training Guide -- Session 1
## Getting Started: From Zero to Productive with Claude Code in VS Code

*A hands-on, step-by-step guide based on a real 2-hour training session. Follow along at your own pace.*

---

## What You'll Learn

By the end of this guide, you will be able to:

- Set up Claude Code in VS Code using the tab-based workflow
- Understand the `.claude/` configuration system (project vs. personal level)
- Run a repository analysis that generates functional and technical documentation
- Use the three operating modes (Ask Before Edit, Auto Edit, Plan Mode)
- Manage context windows and hand off between agents
- Build custom prompts and convert them into reusable commands
- Drill deeper into specific code components for analysis, recommendations, and generated tests
- Automate Git workflows like PR creation and branch cleanup

---

## Prerequisites

- **VS Code** installed
- **Claude Code extension** installed (search "Claude Code" in VS Code Extensions)
- **A Claude account** -- either:
  - **Claude Pro subscription** (recommended for daily users -- flat monthly fee includes Claude Code usage)
  - **Anthropic Console API key** (better for occasional use -- low monthly fee plus per-call charges)
- **Git** installed
- A code repository you're familiar with (for the analysis exercises)

---

## Part 1: Initial Setup

### Step 1: Clone the Starter Kit

Clone the AI Workbench starter repo, which comes pre-loaded with useful commands, skills, and folder structure:

```
git clone https://github.com/JDWorkdog/ai-workbench.git
```

Rename the folder to something personal -- this isn't just for training. This is a workspace you may use long-term for daily productivity tasks like research, document creation, brainstorming, and prompt building. Think of it as your "AI Desktop."

### Step 2: Open the Project in VS Code

Open VS Code and use **File > Open Folder** to open the cloned repository.

### Step 3: Open Claude Code in a Tab

This is the recommended workflow -- tabs are far more powerful than the sidebar or terminal panel.

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Claude" and select **"Claude Code: Open in New Tab"**
3. Notice the small orange dot icon in the top-right corner of VS Code -- clicking it opens additional Claude Code tabs

**Why tabs?** You can run multiple Claude agents in parallel. Start one task in one tab, open another tab for a different task, and switch between them without losing context. This is one of the most productive patterns you'll develop over time.

### Step 4: Authenticate

Click the authentication button in the Claude Code tab:
- **Orange button (Claude AI subscription)**: Use this if you have a Pro subscription
- **Middle button (Anthropic Console API)**: Use this if you're on the API pay-per-use plan

**Which should you choose?** If you plan to use Claude Code daily as part of your development workflow, the subscription is more economical. Heavy daily users will quickly exceed the subscription cost in API charges. For occasional use (a few times per day), the API model may be more cost-effective.

---

## Part 2: Understanding the Configuration System

### The `.claude/` Folder

Open the `.claude/` folder in the VS Code explorer. You'll find two key things:

1. **`CLAUDE.md`** -- A configuration file containing persistent instructions for Claude. Think of it as "custom instructions" that every Claude agent reads when it starts.
2. **`commands/`** -- A folder of markdown files, each defining a reusable slash command.

### Project-Level vs. Personal-Level Configuration

There are actually **two** `.claude/` folders:

| Level | Location | Scope |
|-------|----------|-------|
| **Project-level** | Inside your project folder (`.claude/`) | Only applies to this specific project |
| **Personal-level** | In your home directory (`~/.claude/` on Mac, `C:\Users\<name>\.claude\` on Windows) | Applies globally across ALL projects |

**When to use which:**
- Project-level: Commands and rules specific to one codebase (e.g., "always use C# conventions in this project")
- Personal-level: Commands and rules you want everywhere (e.g., "never give me time estimates," or a cleanup command you use on every project)

**Promoting a command to global:** If you create a command in a project and realize you want it everywhere, just tell Claude: *"Can you copy this command to my personal `.claude/` folder and update my personal `CLAUDE.md` so it knows about it?"*

### Commands vs. Skills (Actions)

Both are stored as simple markdown (`.md`) files:

| Feature | Commands | Skills (Actions) |
|---------|----------|-------------------|
| How to invoke | Type `/command-name` explicitly | Claude detects from natural language |
| Best for | Deliberate, repeatable workflows | When you're describing what you want conversationally |
| Example | `/repo-analysis` | "Can you analyze this codebase for me?" |

**Key insight:** Every command and skill in the starter kit was built by Claude itself through conversation. None were hand-written. You describe what you want, Claude builds the prompt, and then you tell it to save it as a command.

---

## Part 3: Repository Analysis -- Deep Dive

This is where things get powerful. The `/repo-analysis` command scans an entire codebase and generates comprehensive documentation.

### Step 5: Examine the Command

Before running it, read the command to understand what it does:

1. Open `.claude/commands/repo-analysis.md` in VS Code
2. Click the preview icon (magnifying glass on paper) in the top-right to see formatted markdown
3. Notice it generates **two documents**:
   - A **Functional Overview** -- written from a product perspective (what does this software do?)
   - A **Tech Stack Document** -- infrastructure details (frameworks, databases, APIs, deployment, etc.)

This is just a markdown file with structured instructions. Nothing magical -- just good prompt engineering telling Claude what level of detail to go into.

### Step 6: Run the Analysis on Your Own Project

1. Open a new Claude Code tab (`Ctrl/Cmd+Shift+P` > "Claude Code: Open in New Tab")
2. Type `/repo-analysis` and press Tab to autocomplete
3. When prompted, provide the full path to a codebase you're familiar with
   - If the repo is outside your current project, you'll need to grant permission when prompted
4. Watch it work -- Claude reads through every file, understands the structure, and generates both documents

**Tip on permissions:** The first time Claude accesses files outside the current project, it asks permission. You can approve for the entire session to avoid clicking "Yes" on every file.

### What to Expect

The analysis will correctly identify your project's:
- Frameworks and languages
- Database technology
- API patterns
- Caching strategies
- Authentication approaches
- Deployment infrastructure
- Multi-tenancy patterns
- Third-party integrations

**This is incredibly powerful for onboarding.** Instead of spending days having senior engineers whiteboard the architecture for new team members, you generate fresh documentation that's accurate as of that moment. Every time a new person joins, just regenerate it.

### Step 7: Drill Deeper into a Specific Component

The initial analysis gives you a high-level view. But you can keep going:

1. In the same Claude Code tab (or a new one if context is getting full), reference the generated document
2. Ask Claude to go deeper into a specific component. For example:

   > *"I see you identified the MCP server component in the functional overview. Can you go back to the source code and do a deeper analysis of how that component works? Use pseudo-code to walk through the logic. Also identify any limitations you see and suggest enhancements we should consider."*

3. Claude will re-examine the source code with a focused lens and produce a much more detailed breakdown

### Step 8: Generate Implementation Documents

Once you've explored a component and Claude has identified improvements:

> *"This is great guidance. Can you write a full draft document with the implementation steps, code examples, and unit tests? Please save it as a markdown file."*

Claude will generate:
- A structured implementation plan
- Code examples in your project's language (it detects this automatically from the codebase)
- Unit test cases
- Estimated scope information

**Important:** Don't blindly trust everything Claude generates. Treat it like a code review with a knowledgeable colleague. Push back where your domain knowledge tells you something is off. Say things like *"I did it this way because of X reason"* and Claude will either agree or suggest an alternative approach. Work through it conversationally until you're comfortable with the recommendations.

---

## Part 4: The Three Operating Modes

Click the mode indicator below the Claude Code input box to cycle through:

### Ask Before Edit (Default)
Claude asks permission before every file change. **Best for learning** -- you see exactly what it's doing and approve each step. Start here.

### Edit Automatically
Claude executes file changes without asking. **Best for experienced users** working on well-understood tasks where you trust the operations.

### Plan Mode
Claude researches and plans but **does NOT execute any code changes**. This is your brainstorming and architecture mode.

Think of it this way: imagine Claude is a junior developer. In "Ask Before Edit" mode, they show you each change. In "Auto Edit," you've told them to just go. In "Plan Mode," you've said *"Take your hands off the keyboard -- let's just talk this through and make a plan before we touch any code."*

**Plan Mode is incredibly powerful.** Claude will:
- Research current best practices (including live web searches)
- Analyze your codebase
- Propose an architecture or approach
- Ask clarifying questions
- Present a complete plan for your approval

At the end, it will ask: *"Would you like me to execute this plan?"* Be careful -- only approve when you're ready for it to start making changes.

---

## Part 5: Context Window Management

### Understanding the Context Window

As you work with Claude in a single tab, it accumulates context (everything you've discussed, every file it's read). Once it passes 50% capacity, you'll see a percentage indicator appear.

**Why this matters:** When the context window fills up, Claude starts "compacting" -- deleting older context to make room. This often causes it to lose track of important details, leading to hallucinations and incorrect output. This is the #1 reason people have bad experiences with AI coding assistants -- they use the same session for too long.

### The Agent Handoff Pattern

When you see the context indicator appear (or whenever you reach a natural stopping point):

1. **Ask Claude to create a handoff document:**

   > *"I notice your context window is getting full. Please create an agent handoff document with:
   > - Everything you've accomplished so far
   > - What's remaining to be done
   > - Key decisions made and context
   > - A starter prompt I can give to the next agent to pick up where you left off"*

2. Claude writes a markdown file (typically called `agent-handoff.md` or similar) with:
   - A checklist of completed vs. remaining tasks
   - Links to relevant files and documents
   - A ready-to-paste prompt for the next agent

3. **Open a new Claude Code tab**, paste the starter prompt, and the new agent reads the handoff file and continues seamlessly.

Think of it like a shift change at a hospital -- you're handing off patient notes to the next person on duty.

**Pro tip:** Keep the previous tab open. Sometimes you need to go back and reference what the earlier agent did.

**Advanced practice:** Add instructions to your `CLAUDE.md` telling Claude to automatically read the handoff file at the start of every session and update it every 10-15 minutes. This way, if a session unexpectedly ends or context gets compacted, the handoff notes are already current.

---

## Part 6: Building Custom Prompts and Commands

This is how the entire starter kit was built -- and how you'll extend it.

### Step 9: Use the Prompt Builder

1. In a Claude Code tab, type `/prompt` and press Enter
2. Answer the structured questions:
   - **Q1**: Which AI system? (e.g., "Claude")
   - **Q2**: Browser or API? (Browser if you'll paste it into a chat; API if calling programmatically)
   - **Q3**: Describe what you want the prompt to do (be detailed -- this is the most important part)
   - **Q4**: What persona should the AI adopt? (e.g., "engineer," "product manager")
   - **Q5**: What inputs will the user provide?
   - **Q6**: What output format do you want? (e.g., "markdown document")
   - **Q7**: Style guidance (or let Claude use its best judgment)
   - **Q8**: Any constraints? (e.g., "ignore small talk in meeting transcripts," "don't include time estimates")
   - **Q9**: Multiple AI systems? (If yes, it generates tailored versions for each)

**Tip on input quality:** Speaking your prompts (using a voice-to-text tool) tends to produce much more detailed, higher-quality descriptions than typing. When typing, people get lazy and leave out context. When speaking naturally, you explain the *why* behind what you want, which dramatically improves the output.

### Step 10: Test the Prompt

Run the generated prompt and evaluate the results. Iterate if needed -- tell Claude what to adjust.

### Step 11: Convert to a Reusable Command

Once you have a prompt that works well:

> *"This prompt worked great. Can you save it as a Claude command so I can run it anytime with `/command-name`? Also create it as a skill so it triggers from natural language."*

Claude creates the markdown file in your `.claude/commands/` folder. From now on, you (and anyone who clones the repo) can run it with a simple slash command.

**This is the full lifecycle:** Idea -> Prompt Builder -> Test -> Iterate -> Save as Command/Skill

---

## Part 7: Git Workflow Automation

### Create PR Command

Instead of manually constructing pull requests, use a command that:
- Reads all your recent changes
- Generates a descriptive PR title and body
- Runs the appropriate git commands
- Creates the PR with full context

You simply run the command and it handles the entire workflow, already knowing about everything you've changed.

### Post-PR Cleanup Command

After a PR is merged, there's a sequence of cleanup steps that are easy to forget:
- Delete the remote feature branch
- Delete the local feature branch
- Switch back to the develop branch
- Pull latest changes
- Reset your local state

A cleanup command handles all of this in one step, ensuring your local environment stays tidy.

### How These Were Built

These weren't hand-crafted. Here's the actual process:

1. **Switch to Plan Mode**
2. Ask Claude:

   > *"I want to improve how I manage this project's Git workflow. Currently I'm just committing everything to main. I want to follow current best practices with a develop branch, feature branches, PRs, and proper cleanup afterward. Please research current best practices and put together a plan."*

3. Claude goes out, researches current Git branching strategies, and proposes a complete plan
4. Review the plan and refine: *"This is great. Can you also build Claude commands that automate the PR creation and the post-PR cleanup?"*
5. Claude generates the commands based on the plan it just created

The key phrase **"current best practices"** signals Claude to do live web research rather than relying solely on its training data, ensuring you get up-to-date recommendations.

---

## Part 8: Teaching Claude to Self-Correct

One of the most powerful patterns is making Claude learn from its mistakes:

1. **When Claude does something wrong** (wrong file location, bad naming convention, incorrect format), don't just fix it manually
2. **Tell Claude to fix it AND update the rules:**

   > *"You put those files in the wrong location. Please move them to the projects folder, and update the CLAUDE.md so that from now on, all generated files always go into the projects folder."*

3. Claude corrects the current mistake AND writes a permanent rule into `CLAUDE.md`
4. Every future agent that opens this project reads `CLAUDE.md` and follows the corrected behavior

This creates a **self-correcting, self-documenting system**. Over time, your `CLAUDE.md` accumulates all the rules and preferences that make Claude work exactly the way you want.

**Examples of rules people commonly add:**
- "Never give me time estimates"
- "Always save output files to the `projects/` folder"
- "Use descriptive file names, not UUIDs or hashes"
- "When generating code, use the same language and patterns as the existing codebase"

---

## Part 9: Practical Tips

### Use a Temp Files Folder

The `@` file reference in Claude Code only sees files within the current project. If you need to process an external file (a PDF from a supplier, a CSV export, a PowerPoint deck):

1. Drop the file into the `temp-files/` folder in your project
2. Reference it with `@temp-files/filename.pdf`
3. Ask Claude to process it (convert formats, extract data, analyze content, etc.)

### Working with External Files

Claude can write utility scripts on the fly. For example, if someone sends you a PDF catalog and you need it as a CSV:

> *"Please look at @temp-files/catalog.pdf -- starting on page 12 there's a product table. Can you convert that to a CSV file?"*

Claude will write a conversion script, run it, and save the CSV to your projects folder.

### Multiple Projects, One Desktop

Use your AI Desktop workspace for **research and exploration**. When you're ready to implement, move the generated documents (implementation plans, PRDs, test specs) into your actual project repository and work with Claude there in a feature branch.

This keeps your exploration separate from your production code.

### Running Multiple Tasks in Parallel

Once you're comfortable, try having 2-3 Claude Code tabs active simultaneously:
- Tab 1: Running a repo analysis
- Tab 2: Building a prompt
- Tab 3: Researching a technical question

Switch between them as each completes its current step. When you get into this rhythm, your productivity multiplies significantly.

---

## Exercises for Practice

Before the next session, try these on your own:

### Exercise 1: Analyze Your Own Project
Run `/repo-analysis` against a codebase you work in daily. Read through both generated documents and verify the accuracy against your knowledge.

### Exercise 2: Build a Custom Command
Think of a task you do repeatedly. Use `/prompt` to build a prompt for it, test it, and then ask Claude to save it as a command.

### Exercise 3: Deep Dive Analysis
Pick a component from your repo analysis output and ask Claude to drill deeper. Have it generate implementation recommendations and unit tests.

### Exercise 4: Practice Agent Handoffs
In one of your Claude Code sessions, when the context indicator appears, practice creating a handoff document and starting a fresh agent from the handoff prompt.

### Exercise 5: Try Plan Mode
Open a new Claude Code tab, switch to Plan Mode, and ask Claude to research current best practices for something relevant to your work (testing strategies, CI/CD automation, code review processes, etc.). Review the plan it generates.

---

## Quick Reference

| Action | How |
|--------|-----|
| Open Claude Code tab | `Ctrl/Cmd+Shift+P` > "Claude Code: Open in New Tab" |
| Open additional tabs | Click orange dot icon (top-right) |
| Run a command | Type `/command-name` in the input |
| Attach a file | Type `@` and navigate to the file |
| Switch modes | Click the mode text below the input box |
| Preview markdown | Click the magnifying glass icon on an open `.md` file |

## Key Concepts

| Concept | What It Means |
|---------|---------------|
| **CLAUDE.md** | Persistent instructions Claude reads at the start of every session |
| **Commands** | Explicit slash-invoked workflows (e.g., `/repo-analysis`) |
| **Skills/Actions** | Natural-language-triggered workflows |
| **Context window** | Claude's working memory -- monitor the % and hand off before it fills |
| **Agent handoff** | Structured document for transferring work between Claude sessions |
| **Plan Mode** | Research and plan without executing code changes |
| **Current best practices** | Phrase that signals Claude to do live web research |

---

## What's Next (Session 2)

- Working with Claude Code to write and iterate on actual code
- Isolating changes to specific areas using feature branches
- Setting up automated testing and code review on PR submission
- Building CI/CD automation commands

---

*This guide was generated from a live training session. The [AI Workbench starter kit](https://github.com/JDWorkdog/ai-workbench) referenced throughout is freely available.*
