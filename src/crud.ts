import { NidocaDateHelper } from "@domoskanonos/nidoca-date-helper";
import { NidocaHelperForm } from "@domoskanonos/nidoca-form-helper";
import {
  NidocaIconShadowType,
  NidocaDateType,
  NidocaLayoutSpacerSize,
  NidocaLayoutSpacerType,
  NidocaTextType,
  NidocaTypographyType,
  NidocaForm,
  NidocaButtonType,
  NidocaListItem,
  NidocaBorderProperty,
  NidocaList,
  NidocaPrint,
  NidocaLayoutFlexDirection,
  NidocaLayoutFlexWrap,
  NidocaLayoutFlexJustifyContent,
  NidocaLayoutFlexAlignItems,
  NidocaLayoutFlexAlignContent,
  NidocaTheme,
} from "@domoskanonos/nidoca-webcomponents";
import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Vertrag } from "./model/vertrag-model";
import { VertragRemoteRepository } from "./repository/vertrag-repository";
import { PageableContainer } from "@domoskanonos/nidoca-http";

@customElement("microfrontend-vertrag-crud")
export class MicrofrontendFinanceCrud extends LitElement {
  static styles = css``;

  @property({ type: Boolean })
  prominent: boolean = false;

  @property({ type: String })
  title: string = "Verträge";

  @property({ type: Array })
  vertrags: Vertrag[] = [];

  @property({ type: Object })
  vertrag: Vertrag | undefined | null;

  @property({ type: Boolean })
  selectionMode: boolean = false;

  @property({ type: Boolean })
  showDeleteDialog: boolean = false;

  @query("#editElement")
  editElement: NidocaForm | undefined;

  @property({ type: Boolean })
  elevationSettingsShow: boolean = false;

  @property({ type: Object })
  elevationSettingsAssociatedElement: HTMLElement | undefined;

  @query("#list")
  nidocaList: NidocaList | undefined;

  @query("#kuendigungDrucken")
  nidocaPrint: NidocaPrint | undefined;

  private nidocaDateHelper: NidocaDateHelper = new NidocaDateHelper();

  constructor() {
    super();
    this.search("");
  }

  render(): TemplateResult {
    return html`
      <nidoca-top-app-bar .prominent="${this.prominent}">
        ${this.vertrag
          ? html`<nidoca-icon
                icon="arrow_back_ios_new"
                slot="left"
                title="Zurück"
                @click="${() => {
                  this.vertrag = undefined;
                  this.title = "Verträge";
                }}"
              ></nidoca-icon>
              ${this.vertrag.id
                ? html`<nidoca-icon
                    icon="delete"
                    slot="right"
                    title="Vertrag löschen"
                    @click="${() => {
                      this.showDeleteDialog = true;
                    }}"
                  ></nidoca-icon>`
                : html``}
              <nidoca-icon
                icon="done"
                slot="right"
                title="Vertrag speichern"
                @click="${() => {
                  this.save();
                }}"
              ></nidoca-icon>`
          : html` <nidoca-icon
                slot="right"
                icon="${this.prominent ? "search_off" : "search"}"
                title="Verträge suchen"
                @nidoca-event-icon-clicked="${() =>
                  (this.prominent = !this.prominent)}"
              ></nidoca-icon>

              <nidoca-search-bar
                slot="prominent"
                placeholder="Suche..."
                @nidoca-search-bar-event-value-changed="${(
                  event: CustomEvent
                ) => this.search(event.detail)}"
              ></nidoca-search-bar>`}

        <nidoca-icon
          slot="right"
          icon="more_vert"
          .clickable="${true}"
          @nidoca-event-icon-clicked="${(event: CustomEvent) => {
            this.elevationSettingsAssociatedElement = <HTMLElement>event.target;
            this.elevationSettingsShow = true;
          }}"
        ></nidoca-icon>

        <nidoca-layout-spacer
          cssStyle="width:100%;"
          slot="left"
          .spacerSize="${NidocaLayoutSpacerSize.BIG}"
          .spacerTypes="${[NidocaLayoutSpacerType.LEFT]}"
        >
          <nidoca-typography .typographyType="${NidocaTypographyType.BODY1}"
            >${this.title}</nidoca-typography
          ></nidoca-layout-spacer
        >
      </nidoca-top-app-bar>

      ${this.vertrag
        ? html`<nidoca-form
            id="editElement"
            class="container"
            @input="${() => this.inputChanged()}"
          >
            <nidoca-form-text
              type=${NidocaTextType.HIDDEN}
              name="id"
              label="id"
              value="${this.vertrag.id ? this.vertrag.id : ""}"
            >
            </nidoca-form-text>

            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.TEXT}
                name="name"
                label="Name"
                required
                value="${this.vertrag.name}"
              >
              </nidoca-form-text>
            </nidoca-layout-spacer>

            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-textarea
                name="beschreibung"
                label="Beschreibung"
                value="${this.vertrag.beschreibung}"
              >
              </nidoca-form-textarea>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-textarea
                name="adresse"
                label="Adresse"
                required
                value="${this.vertrag.adresse}"
              >
              </nidoca-form-textarea>
            </nidoca-layout-spacer>

            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.EMAIL}
                name="email"
                label="Email"
                required
                value="${this.vertrag.email}"
              ></nidoca-form-text>
            </nidoca-layout-spacer>

            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.TEXT}
                name="vertragsnehmer"
                label="vertragsnehmer"
                required
                value="${this.vertrag.vertragsnehmer}"
              ></nidoca-form-text>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.TEXT}
                name="internetseite"
                label="Internetseite"
                value="${this.vertrag.internetseite}"
              >
              </nidoca-form-text>
            </nidoca-layout-spacer>

            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.TEXT}
                name="benutzername"
                label="Benutzername"
                value="${this.vertrag.benutzername}"
              >
              </nidoca-form-text>
            </nidoca-layout-spacer>

            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-date
                type="${NidocaDateType.DATE}"
                name="vertragsbeginn"
                label="Vertragsbegin"
                required
                .value="${this.nidocaDateHelper.formatDate(
                  this.vertrag.vertragsbeginn,
                  "yyyy-MM-dd"
                )}"
              >
              </nidoca-form-date>
            </nidoca-layout-spacer>

            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-date
                type="${NidocaDateType.DATE}"
                name="vertragsende"
                label="Vertragsende"
                .value="${this.nidocaDateHelper.formatDate(
                  this.vertrag.vertragsende,
                  "yyyy-MM-dd"
                )}"
              >
              </nidoca-form-date>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-date
                type="${NidocaDateType.DATE}"
                name="kuendigungsfrist"
                label="Kündigungsfrist"
                required
                .value="${this.nidocaDateHelper.formatDate(
                  this.vertrag.kuendigungsfrist,
                  "yyyy-MM-dd"
                )}"
              >
              </nidoca-form-date>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.TEXT}
                name="vertragsnummer"
                label="Vertragsnummer"
                required
                value="${this.vertrag.vertragsnummer}"
              >
              </nidoca-form-text>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.TEXT}
                name="supporttelefon"
                label="Support-Telefon"
                value="${this.vertrag.supporttelefon}"
              >
              </nidoca-form-text>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.NUMBER}
                name="kosten"
                label="Kosten"
                value="${this.vertrag.kosten}"
              >
              </nidoca-form-text>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-text
                type=${NidocaTextType.NUMBER}
                name="abrechnungsperiode"
                label="Kosten Interval"
                value="${this.vertrag.abrechnungsperiode}"
              >
              </nidoca-form-text>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-switch
                name="aktiv"
                label="Vertrag aktiv ?"
                infoText="Ist der Vertrag zurzeit aktiv ?"
                .checked="${this.vertrag.aktiv}"
              ></nidoca-form-switch>
            </nidoca-layout-spacer>
            <nidoca-layout-spacer
              cssStyle="width:100%;"
              .spacerSize="${NidocaLayoutSpacerSize.SMALL}"
              .spacerTypes="${[
                NidocaLayoutSpacerType.TOP,
                NidocaLayoutSpacerType.RIGHT,
                NidocaLayoutSpacerType.LEFT,
              ]}"
            >
              <nidoca-form-switch
                name="gekuendigt"
                label="Vertrag gekündigt ?"
                infoText="Wurde der Vertrag bereits gekündigt ?"
                .checked="${this.vertrag.gekuendigt}"
              ></nidoca-form-switch>
            </nidoca-layout-spacer>
          </nidoca-form>`
        : html`
            <nidoca-icon-extended
              icon="add"
              title="Neuen Vertrag anlegen"
              @click="${() => this.newVertrag()}"
              style="position: fixed;  bottom: 20px; right: 20px; z-index:100;"
              .theme="${NidocaTheme.SECONDARY}"
              .clickable="${true}"
              .shadowType="${NidocaIconShadowType.SHADOW_2}"
              .round="${true}"
              cssStyle="padding:12px;"
            ></nidoca-icon-extended>

            <nidoca-list id="list" .selectionMode="${this.selectionMode}">
              ${this.vertrags.map(
                (item) => html`
                  <nidoca-list-item
                    @nidoca-event-list-item-click="${() =>
                      this.listItemClick(item)}"
                    @nidoca-event-list-item-long-click="${(
                      event: CustomEvent
                    ) => this.listItemLongClick(event)}"
                  >
                    <nidoca-layout-spacer
                      cssStyle="width:100%;"
                      .spacerSize="${NidocaLayoutSpacerSize.ZERO}"
                    >
                      <nidoca-typography
                        .typographyType="${NidocaTypographyType.H6}"
                        >${item.name}</nidoca-typography
                      >
                    </nidoca-layout-spacer>

                    <nidoca-layout-flex-container
                      .flexDirection="${NidocaLayoutFlexDirection.ROW}"
                      .flexWrap="${NidocaLayoutFlexWrap.WRAP}"
                      .flexJustifyContent="${NidocaLayoutFlexJustifyContent.FLEX_START}"
                      .flexAlignItems="${NidocaLayoutFlexAlignItems.START}"
                      .flexAlignContent="${NidocaLayoutFlexAlignContent.START}"
                      slot="secondary"
                    >
                      ${item.gekuendigt
                        ? html`<nidoca-icon
                            cssStyle="color:var(--app-color-warning-background);"
                            icon="unsubscribe"
                            title="Kündigung versendet"
                          ></nidoca-icon>`
                        : html``}
                      <nidoca-layout-spacer
                        cssStyle="width:100%;"
                        .spacerSize="${NidocaLayoutSpacerSize.ZERO}"
                      >
                        <nidoca-typography
                          .typographyType="${NidocaTypographyType.BODY2}"
                          >${item.beschreibung}</nidoca-typography
                        >
                        <nidoca-typography
                          style="${this.getKuendigungsfristStyle(
                            item.kuendigungsfrist
                          )
                            ? "color:var(--app-color-success-background)"
                            : "color:var(--app-color-error-background);"}"
                          .typographyType="${NidocaTypographyType.BODY2}"
                          >${this.nidocaDateHelper.formatDate(
                            item.kuendigungsfrist,
                            "dd-MM-yyyy"
                          )}</nidoca-typography
                        >
                      </nidoca-layout-spacer>
                    </nidoca-layout-flex-container>

                    <nidoca-icon
                      slot="graphic"
                      style="color:var(--app-color-${item.aktiv
                        ? "success"
                        : "error"}-background)"
                      icon="${item.aktiv ? "done" : "cancel"}"
                    ></nidoca-icon>

                    ${this.selectionMode
                      ? html``
                      : html`<nidoca-icon
                          slot="meta"
                          icon="arrow_right"
                        ></nidoca-icon>`}
                  </nidoca-list-item>
                  <nidoca-border
                    .borderProperties="${[
                      NidocaBorderProperty.BOTTOM,
                      NidocaBorderProperty.FULL_WIDTH,
                    ]}"
                  ></nidoca-border>
                `
              )}
            </nidoca-list>
          `}
      <nidoca-dialog-action .show="${this.showDeleteDialog}">
        <nidoca-typography
          slot="header"
          typographyType="${NidocaTypographyType.H1}"
          >Vertrag löschen ?</nidoca-typography
        >
        <nidoca-typography
          slot="text"
          typographyType="${NidocaTypographyType.BODY1}"
          >Möchtest du den Vertrag wirklich löschen ? Er geht unwiederruflich
          verloren.</nidoca-typography
        >

        <nidoca-button
          slot="action"
          buttonType="${NidocaButtonType.TEXT}"
          @click="${() => {
            this.delete();
          }}"
          >Ok</nidoca-button
        >
        <nidoca-layout-spacer
          slot="action"
          .spacerSize="${NidocaLayoutSpacerSize.BIG}"
          .spacerTypes="${[NidocaLayoutSpacerType.RIGHT]}"
        ></nidoca-layout-spacer>
        <nidoca-button
          slot="action"
          buttonType="${NidocaButtonType.TEXT}"
          @click="${() => (this.showDeleteDialog = false)}"
          >Abbrechen</nidoca-button
        >
      </nidoca-dialog-action>
      <nidoca-elevation
        .show="${this.elevationSettingsShow}"
        .associatedElement="${this.elevationSettingsAssociatedElement}"
        @nidoca-elevation-event-closeme="${() =>
          (this.elevationSettingsShow = false)}"
      >
        <nidoca-list>
          ${this.vertrag
            ? html`<nidoca-list-item @click="${() => this.kuendigungDrucken()}">
                  <nidoca-typography
                    .typographyType="${NidocaTypographyType.H6}"
                    >Kündigung drucken</nidoca-typography
                  >
                  <nidoca-icon slot="graphic" icon="print"></nidoca-icon>
                </nidoca-list-item>

                <nidoca-list-item
                  title="Vertrag löschen"
                  @click="${() => {
                    this.kuendigungsmailSenden();
                  }}"
                >
                  <nidoca-typography
                    .typographyType="${NidocaTypographyType.H6}"
                    >Vertrag kündigen</nidoca-typography
                  >
                  <nidoca-icon slot="graphic" icon="mail"></nidoca-icon>
                </nidoca-list-item>`
            : this.selectionMode
            ? html`
             <nidoca-list-item
                  title="Vertrag löschen"
                  @click="${() => {
                    this.showDeleteDialog = true;
                  }}"
                >
                  <nidoca-typography
                    .typographyType="${NidocaTypographyType.H6}"
                    >Vertrag löschen</nidoca-typography
                  >
                  <nidoca-icon slot="graphic" icon="delete"></nidoca-icon>
                </nidoca-list-item>
              <nidoca-list-item>
                <nidoca-typography .typographyType="${NidocaTypographyType.H6}"
                  >Teilen</nidoca-typography
                >
                <nidoca-icon slot="graphic" icon="share"></nidoca-icon>
              </nidoca-list-item>

              <nidoca-list-item @click="${() => this.nidocaList?.selectAll()}">
                <nidoca-typography .typographyType="${NidocaTypographyType.H6}"
                  >Alle auswählen</nidoca-typography
                >
                <nidoca-icon slot="graphic" icon="check_box"></nidoca-icon
              ></nidoca-list-item>
              <nidoca-list-item @click="${() => (this.selectionMode = false)}">
                <nidoca-typography .typographyType="${NidocaTypographyType.H6}"
                  >Alle abwählen</nidoca-typography
                >
                <nidoca-icon
                  slot="graphic"
                  icon="check_box_outline_blank"
                ></nidoca-icon
              ></nidoca-list-item>
            </nidoca-list>`
            : html`
                <nidoca-list-item
                  icon="add"
                  @click="${() => this.newVertrag()}"
                >
                  <nidoca-typography
                    .typographyType="${NidocaTypographyType.H6}"
                    >Neuer Vertrag</nidoca-typography
                  >
                  <nidoca-icon slot="graphic" icon="add"></nidoca-icon>
                </nidoca-list-item>
              `}
        </nidoca-list>
      </nidoca-elevation>
      <nidoca-print id="kuendigungDrucken">
        Kündigung meines Vertrages, Vertragsnummer:
        ${this.vertrag?.vertragsnummer}
        <br />
      </nidoca-print>
    `;
  }
  kuendigungDrucken() {
    if (this.nidocaPrint) {
      console.log("Kündigung drucken...");
      this.nidocaPrint.print();
    }
  }
  kuendigungsmailSenden(): void {
    const email = this.vertrag?.email;
    const subject = `Kündigung meines Vertrages, Vertragsnummer: ${this.vertrag?.vertragsnummer}`;
    const emailBody = `Sehr geehrte Damen und Herren, hiermit kündige ich meinen Vertrag mit der oben genannten Vertragsnummer zum nächstmöglichen Zeitpunkt. Bitte bestätigen Sie mir meine Kündigung schriftlich. Mit freundlichen Grüßen, ${this.vertrag?.vertragsnehmer}`;
    const attach = "Kein Anhang";
    document.location.href =
      "mailto:" +
      email +
      "?subject=" +
      subject +
      "&body=" +
      emailBody +
      "?attach=" +
      attach;
  }
  getKuendigungsfristStyle(kuendigungsfrist: Date): boolean {
    const diffDays: number | null = this.nidocaDateHelper.diffDays(
      new Date(),
      kuendigungsfrist
    );
    return diffDays ? diffDays > 60 : false;
  }

  inputChanged(): void {
    const nidocaFormHelper: NidocaHelperForm<Vertrag> = new NidocaHelperForm();
    this.vertrag = nidocaFormHelper.getCurrent(this);
    console.log(this.vertrag);
  }

  newVertrag(): void {
    this.vertrag = new Vertrag();
  }

  async delete(): Promise<void> {
    if (this.selectionMode) {
      const selectedIndexes: number[] | undefined =
        this.nidocaList?.getSelectedIndexes();
      if (selectedIndexes) {
        for (let i = 0; i < selectedIndexes.length; i++) {
          const vertrag = this.vertrags[selectedIndexes[i]];
          if (vertrag && vertrag.id) {
            await VertragRemoteRepository.getUniqueInstance().delete(
              vertrag.id
            );
          }
        }
      }
    } else if (this.vertrag && this.vertrag.id) {
      await VertragRemoteRepository.getUniqueInstance().delete(this.vertrag.id);
      this.vertrag = null;
    }
    this.showDeleteDialog = false;
    this.search("");
  }
  async save(): Promise<void> {
    if (this.editElement?.validate()) {
      const nidocaFormHelper: NidocaHelperForm<Vertrag> =
        new NidocaHelperForm();
      this.vertrag = nidocaFormHelper.getCurrent(this.editElement);
      if (this.vertrag && this.vertrag.id) {
        this.vertrag = await VertragRemoteRepository.getUniqueInstance().update(
          this.vertrag.id,
          this.vertrag
        );
      } else if (this.vertrag) {
        this.vertrag =
          await VertragRemoteRepository.getUniqueInstance().persist(
            this.vertrag
          );
      }
      this.vertrag = null;
      this.vertrags = [];
      this.search("");
    }
  }

  listItemClick(vertrag: Vertrag): void {
    if (!this.selectionMode) {
      this.vertrag = vertrag;
      this.title = this.vertrag.name;
    }
  }

  listItemLongClick(event: CustomEvent): void {
    this.selectionMode = true;
    const nidocaListItem: NidocaListItem = <NidocaListItem>event.target;
    nidocaListItem.selected = true;
  }

  search(searchText: string): void {
    console.log("search text: %s", searchText);
    VertragRemoteRepository.getUniqueInstance()
      .search(0, 0, "kuendigungsfrist:asc", "name=" + searchText)
      .then((pc: PageableContainer<Vertrag>) => {
        console.trace("load vertrags, size: %s", pc.content.length);
        this.vertrags = pc.content;
      });
  }
}
