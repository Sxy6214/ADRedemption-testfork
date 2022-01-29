import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

Vue.component("challenges-header", {
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isInChallenge: false,
      isShowAllVisible: false,
      isAutoECVisible: false,
      showAllChallenges: false,
      autoEC: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
    };
  },
  watch: {
    autoEC(newValue) {
      player.reality.autoEC = newValue;
    },
    showAllChallenges(newValue) {
      player.options.showAllChallenges = newValue;
    },
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.isInChallenge = Player.isInAnyChallenge;
      this.isShowAllVisible = PlayerProgress.eternityUnlocked();
      this.isAutoECVisible = Perk.autocompleteEC1.isBought && !Pelle.isDoomed;
      this.autoEC = player.reality.autoEC;
      const remainingCompletions = EternityChallenges.remainingCompletions;
      this.remainingECTiers = remainingCompletions;
      if (remainingCompletions !== 0) {
        const autoECInterval = EternityChallenges.autoComplete.interval;
        const untilNextEC = Math.max(autoECInterval - player.reality.lastAutoEC, 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC + (autoECInterval * (remainingCompletions - 1)));
      }
    },
    restartChallenge() {
      const current = Player.anyChallenge;
      if (Player.isInAnyChallenge) {
        current.exit();
        current.start();
      }
    },
    exitChallenge() {
      const current = Player.anyChallenge;
      if (Player.isInAnyChallenge) {
        current.exit();
      }
    },
  },
  template: `
    <div class="l-challenges-tab__header">
      <div class="c-subtab-option-container" v-if="isShowAllVisible || isAutoECVisible || isInChallenge">
        <PrimaryToggleButton
          v-if="isShowAllVisible"
          v-model="showAllChallenges"
          class="o-primary-btn--subtab-option"
          label="Show all known challenges:"
        />
        <PrimaryToggleButton
          v-if="isAutoECVisible"
          v-model="autoEC"
          class="o-primary-btn--subtab-option"
          label="Auto Eternity Challenges:"
        />
        <PrimaryButton
          v-if="isInChallenge"
          class="o-primary-btn--subtab-option"
          @click="restartChallenge"
        >
          Restart Challenge
        </PrimaryButton>
        <PrimaryButton
          v-if="isInChallenge"
          class="o-primary-btn--subtab-option"
          @click="exitChallenge"
        >
          Exit Challenge
        </PrimaryButton>
      </div>
      <div v-if="autoEC && isAutoECVisible">
        Eternity Challenges are automatically completed sequentially, requiring all previous
        Eternity Challenges to be fully completed before any progress is made.
      </div>
      <div
        v-if="autoEC && isAutoECVisible && remainingECTiers > 0"
        class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info"
      >
        <div class="l-challenges-tab__auto-ec-timers">
          <span v-if="remainingECTiers > 1">
            Next Auto Eternity Challenge completion in: {{ untilNextEC }} (real time)
          </span>
          <span>
            All Auto Eternity Challenge completions in: {{ untilAllEC }} (real time)
          </span>
        </div>
      </div>
    </div>`
});
