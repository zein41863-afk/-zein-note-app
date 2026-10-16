Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message, grade } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "الرسالة مطلوبة" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const studentGrade = grade || "الأول الإعدادي";

    const replies: string[] = [
      `سؤال جميل يا بطل! 🌟 خليني أشرحلك ببساطة:\n\n${message} — ده موضوع مهم في ${studentGrade}. عشان تفهمه كويس، تخيله كأنه قطعة بازل بتركبها خطوة بخطوة. عايزني أعمّق في الشرح ولا ننتقل لمثال؟`,
      `عاش يا بطل! 💪 سؤالك عن "${message}" من الأسئلة المهمة. خليني أبسّطلك الفكرة:\n\nتخيل إن الموضوع ده زي الدرج — كل خطوة بتجيبك أقرب للفهم الكامل. تحب أكمل شرح ولا نحل سؤال عليه؟`,
      `ممتاز إنك بتسأل! 🎯 بخصوص "${message}" في ${studentGrade}:\n\nالفكرة الأساسية إن كل حاجة ليها أساس بنعلي عليه. أنا هنا عشان أساعدك تفهم الأساس ده كويس قوي. إيه الجزء اللي محتاج تركيز أكتر؟`,
      `حلو سؤالك يا بطل! 😊 "${message}" — خليني أقولك عليه سر بسيط:\n\nلو فهمت الفكرة الأساسية، هتقدر تحل أي سؤال عليها. عايزني أديك مثال من الحياة اليومية؟`,
      ` Bravo يا بطل! 👏 سؤال "${message}" يدل إنك بتفكر صح. في ${studentGrade}، الموضوع ده بيتشرح بأسلوب مبسط. تحب أبدأ من الأول ولا تختار نقطة معينة نفصل فيها؟`,
    ];

    const reply = replies[Math.floor(Math.random() * replies.length)];

    return new Response(
      JSON.stringify({ success: true, reply }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "المدرس مشغول، جرب تاني" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
