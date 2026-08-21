import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// টুলস ডেফিনিশন
const tools = [
  {
    name: "create_document",
    description: "ডকুমেন্ট তৈরি করুন (Word, PDF, HTML ফরম্যাটে)",
    input_schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "ডকুমেন্টের শিরোনাম",
        },
        content: {
          type: "string",
          description: "ডকুমেন্টের কন্টেন্ট",
        },
        format: {
          type: "string",
          enum: ["word", "pdf", "html"],
          description: "ডকুমেন্ট ফরম্যাট",
        },
        template: {
          type: "string",
          description: "টেমপ্লেট টাইপ (invoice, report, letter, etc)",
        },
      },
      required: ["title", "content", "format"],
    },
  },
  {
    name: "process_data",
    description: "ডেটা প্রসেসিং - ফিল্টার, সর্ট, গণনা করুন",
    input_schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          description: "প্রসেস করার ডেটা",
        },
        operation: {
          type: "string",
          enum: ["filter", "sort", "aggregate", "transform"],
          description: "কি অপারেশন করবেন",
        },
        criteria: {
          type: "string",
          description: "ফিল্টার/সর্ট করার মানদণ্ড",
        },
      },
      required: ["data", "operation"],
    },
  },
  {
    name: "process_image",
    description: "ইমেজ প্রসেসিং - রিসাইজ, ক্রপ, ওয়াটারমার্ক যোগ করুন",
    input_schema: {
      type: "object",
      properties: {
        image_path: {
          type: "string",
          description: "ইমেজ ফাইলের পথ",
        },
        operation: {
          type: "string",
          enum: ["resize", "crop", "rotate", "watermark", "convert"],
          description: "কি অপারেশন করবেন",
        },
        parameters: {
          type: "object",
          description: "অপারেশনের প্যারামিটার",
        },
      },
      required: ["image_path", "operation"],
    },
  },
  {
    name: "manage_calendar",
    description: "ক্যালেন্ডার ইভেন্ট তৈরি, সম্পাদনা, ডিলিট করুন",
    input_schema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["create", "update", "delete", "list"],
          description: "কি অ্যাকশন করবেন",
        },
        event_title: {
          type: "string",
          description: "ইভেন্টের নাম",
        },
        start_time: {
          type: "string",
          description: "শুরু সময় (ISO 8601 ফরম্যাট)",
        },
        end_time: {
          type: "string",
          description: "শেষ সময় (ISO 8601 ফরম্যাট)",
        },
        description: {
          type: "string",
          description: "ইভেন্ট বর্ণনা",
        },
        attendees: {
          type: "array",
          description: "অংশগ্রহণকারীদের ইমেইল",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "send_email",
    description: "ইমেইল খসড়া তৈরি এবং পাঠান",
    input_schema: {
      type: "object",
      properties: {
        to: {
          type: "array",
          description: "গ্রাহকের ইমেইল ঠিকানা",
        },
        subject: {
          type: "string",
          description: "ইমেইলের বিষয়",
        },
        body: {
          type: "string",
          description: "ইমেইলের বডি",
        },
        cc: {
          type: "array",
          description: "CC এর ইমেইল ঠিকানা",
        },
        bcc: {
          type: "array",
          description: "BCC এর ইমেইল ঠিকানা",
        },
        attachments: {
          type: "array",
          description: "অ্যাটাচমেন্টের ফাইল পথ",
        },
        action: {
          type: "string",
          enum: ["draft", "send"],
          description: "খসড়া তৈরি করুন নাকি পাঠান",
        },
      },
      required: ["to", "subject", "body", "action"],
    },
  },
];

// টুল এক্সিকিউশন ফাংশন
function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>
): string {
  console.log(`\n🔧 এক্সিকিউট করছি: ${toolName}`);
  console.log(`📥 ইনপুট:`, JSON.stringify(toolInput, null, 2));

  switch (toolName) {
    case "create_document":
      return handleCreateDocument(toolInput);
    case "process_data":
      return handleProcessData(toolInput);
    case "process_image":
      return handleProcessImage(toolInput);
    case "manage_calendar":
      return handleManageCalendar(toolInput);
    case "send_email":
      return handleSendEmail(toolInput);
    default:
      return `❌ অজানা টুল: ${toolName}`;
  }
}

function handleCreateDocument(input: Record<string, unknown>): string {
  const { title, content, format, template } = input;
  console.log(`✅ ডকুমেন্ট তৈরি হচ্ছে:`);
  console.log(`   📄 শিরোনাম: ${title}`);
  console.log(`   📝 ফরম্যাট: ${format}`);
  console.log(`   🎨 টেমপ্লেট: ${template || "ডিফল্ট"}`);
  return `✅ ডকুমেন্ট সফলভাবে তৈরি হয়েছে: ${title}.${format}`;
}

function handleProcessData(input: Record<string, unknown>): string {
  const { data, operation, criteria } = input;
  console.log(`✅ ডেটা প্রসেসিং হচ্ছে:`);
  console.log(`   🔄 অপারেশন: ${operation}`);
  console.log(`   📊 ডেটা আইটেম: ${(data as []).length}`);
  console.log(`   🎯 মানদণ্ড: ${criteria || "কোনো মানদণ্ড নেই"}`);
  return `✅ ডেটা প্রসেসিং সম্পন্ন (${(data as []).length} আইটেম)`;
}

function handleProcessImage(input: Record<string, unknown>): string {
  const { image_path, operation, parameters } = input;
  console.log(`✅ ইমেজ প্রসেসিং হচ্ছে:`);
  console.log(`   🖼️  ফাইল: ${image_path}`);
  console.log(`   🔄 অপারেশন: ${operation}`);
  console.log(`   ⚙️  প্যারামিটার:`, parameters);
  return `✅ ইমেজ সফলভাবে প্রসেস হয়েছে`;
}

function handleManageCalendar(input: Record<string, unknown>): string {
  const { action, event_title, start_time, end_time } = input;
  console.log(`✅ ক্যালেন্ডার পরিচালনা করছি:`);
  console.log(`   📅 অ্যাকশন: ${action}`);
  console.log(`   🎫 ইভেন্ট: ${event_title}`);
  console.log(`   ⏰ সময়: ${start_time} - ${end_time}`);
  return `✅ ক্যালেন্ডার ইভেন্ট ${action} সম্পন্ন`;
}

function handleSendEmail(input: Record<string, unknown>): string {
  const { to, subject, action } = input;
  console.log(`✅ ইমেইল পরিচালনা করছি:`);
  console.log(`   📧 প্রাপক: ${(to as []).join(", ")}`);
  console.log(`   📋 বিষয়: ${subject}`);
  console.log(`   ✉️  অ্যাকশন: ${action}`);
  return `✅ ইমেইল ${action} সম্পন্ন`;
}

// মেইন এজেন্ট লুপ
async function runMasterAgent(userRequest: string) {
  console.log("\n" + "=".repeat(60));
  console.log("🤖 MASTER AUTOMATION AGENT শুরু হচ্ছে");
  console.log("=".repeat(60));
  console.log(`\n👤 ব্যবহারকারীর অনুরোধ: ${userRequest}\n`);

  const messages: Anthropic.Messages.MessageParam[] = [
    {
      role: "user",
      content: userRequest,
    },
  ];

  let response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    tools: tools as Anthropic.Messages.Tool[],
    messages: messages,
  });

  console.log(`\n🤖 Claude সাড়া: ${response.stop_reason}`);

  // টুল কল প্রসেস করুন
  while (response.stop_reason === "tool_use") {
    const toolUseBlock = response.content.find(
      (block) => block.type === "tool_use"
    ) as Anthropic.Messages.ToolUseBlock | undefined;

    if (!toolUseBlock) break;

    const toolName = toolUseBlock.name;
    const toolInput = toolUseBlock.input as Record<string, unknown>;
    const toolUseId = toolUseBlock.id;

    const toolResult = executeTool(toolName, toolInput);

    // টুল রেজাল্ট যোগ করুন
    messages.push({
      role: "assistant",
      content: response.content,
    });

    messages.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: toolUseId,
          content: toolResult,
        },
      ],
    });

    // পরবর্তী রেসপন্স পান
    response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      tools: tools as Anthropic.Messages.Tool[],
      messages: messages,
    });
  }

  // ফাইনাল মেসেজ
  const finalText = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as Anthropic.Messages.TextBlock).text)
    .join("\n");

  console.log("\n" + "=".repeat(60));
  console.log("✅ MASTER AUTOMATION AGENT ফলাফল:");
  console.log("=".repeat(60));
  console.log(finalText);
  console.log("=".repeat(60) + "\n");
}

// উদাহরণ অনুরোধ
const exampleRequest = `
আমাকে নিম্নলিখিত কাজগুলি করতে হবে:
1. একটি মাসিক রিপোর্ট ডকুমেন্ট তৈরি করুন (PDF ফরম্যাটে)
2. এই ডেটা প্রসেস করুন: বিক্রয় তালিকা ফিল্টার করুন যেখানে পরিমাণ > 100
3. কোম্পানির লোগো ইমেজ রিসাইজ করুন (500x500 পিক্সেলে)
4. আগামী সোমবার সকাল ১০টায় দলের মিটিং এর জন্য ক্যালেন্ডার ইভেন্ট তৈরি করুন
5. সম্পন্ন রিপোর্ট সহ পরিচালকদের কাছে ইমেইল পাঠান
`;

// এজেন্ট চালান
runMasterAgent(exampleRequest).catch(console.error);
